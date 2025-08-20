import React, { useEffect, useState, useMemo, useCallback } from "react";
import dayjs from "dayjs";
import "../../styles/attendancetable.css";
import SidebarToggle from "./SidebarToggle";
import { useExecutiveActivity } from "../../context/ExecutiveActivityContext";
import { useLoading } from "../../context/LoadingContext";
import AdminSpinner from "../spinner/AdminSpinner";
import { useApi } from "../../context/ApiContext";

const AttendanceTable = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [dates, setDates] = useState([]);
  const [startDate, setStartDate] = useState(dayjs().startOf("month"));
  const [endDate, setEndDate] = useState(dayjs().endOf("month"));
  const [showPayroll, setShowPayroll] = useState(false);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("Manager"); // Default to Manager

  const [allHRs, setAllHRs] = useState([]);
  const [allManagers, setAllManagers] = useState([]);
  const [allTLs, setAllTLs] = useState([]);
  const [allExecutives, setAllExecutives] = useState([]);

  const { showLoader, hideLoader, isLoading, variant } = useLoading();
  const { handleGetAttendance } = useExecutiveActivity();
  const {
    fetchAllHRsAPI,
    fetchAllManagersAPI,
    fetchAllTeamLeadsAPI,
    fetchExecutivesAPI,
  } = useApi();

  const isSidebarExpanded =
    localStorage.getItem("adminSidebarExpanded") === "true";

  // ✅ Use useCallback to memoize fetchAttendance function
  const fetchAttendance = useCallback(async () => {
    try {
      showLoader("Fetching attendance report...", "admin");
      const data = await handleGetAttendance(
        startDate.format("YYYY-MM-DD"),
        endDate.format("YYYY-MM-DD")
      );
      setAttendanceData(data);
      if (data.length > 0) {
        setDates(Object.keys(data[0].attendance));
      }
    } catch (error) {
      console.error("Failed to fetch attendance data", error);
    } finally {
      hideLoader();
    }
  }, [startDate, endDate, handleGetAttendance, showLoader, hideLoader]);

  // 🔁 Fetch attendance when not in payroll view or when date range changes
  useEffect(() => {
    if (!showPayroll) {
      fetchAttendance();
    }
  }, [showPayroll, fetchAttendance]);

  // 🔁 Fetch selected department roles when payroll view is active
  useEffect(() => {
    if (!showPayroll) return;

    const fetchDepartmentData = async () => {
      try {
        showLoader("Fetching employees...", "admin");

        // Clear all roles
        setAllHRs([]);
        setAllManagers([]);
        setAllTLs([]);
        setAllExecutives([]);

        switch (department) {
          case "HR":
            const hrRes = await fetchAllHRsAPI();
            setAllHRs(hrRes?.hrs || hrRes?.data || []);
            break;
          case "Manager":
            const mgrRes = await fetchAllManagersAPI();
            setAllManagers(mgrRes?.managers || mgrRes?.data || []);
            break;
          case "TL":
            const tlRes = await fetchAllTeamLeadsAPI();
            setAllTLs(tlRes?.teamLeads || tlRes?.data || []);
            break;
          case "Executive":
            const execRes = await fetchExecutivesAPI();
            setAllExecutives(execRes?.executives || execRes?.data || []);
            break;
          default:
            break;
        }
      } catch (error) {
        console.error("❌ Error fetching roles:", error);
      } finally {
        hideLoader();
      }
    };

    fetchDepartmentData();
  }, [showPayroll, department, fetchAllHRsAPI, fetchAllManagersAPI, fetchAllTeamLeadsAPI, fetchExecutivesAPI, showLoader, hideLoader]);

  const isFutureDate = (date) => dayjs(date).isAfter(dayjs(), "day");

  // ✅ Get current employees by selected department
  const allEmployees = useMemo(() => {
    if (department === "HR") return allHRs;
    if (department === "Manager" || department === "") return allManagers;
    if (department === "TL") return allTLs;
    if (department === "Executive") return allExecutives;
    return [];
  }, [allHRs, allManagers, allTLs, allExecutives, department]);

  // ✅ Filtered by search
  const filteredEmployees = useMemo(() => {
    return allEmployees.filter((emp) => {
      const name = emp.name || emp.username || "Unnamed";
      return (
        name.toLowerCase().includes(search.toLowerCase()) ||
        emp.id?.toString().includes(search.toLowerCase())
      );
    });
  }, [allEmployees, search]);

  return (
    <div
      className={`create-executive-container ${
        isSidebarExpanded ? "sidebar-expanded" : "sidebar-collapsed"
      }`}
    >
      <SidebarToggle />
      <div className="attendance-container" style={{ position: "relative" }}>
        {isLoading && variant === "admin" && (
          <AdminSpinner text="Loading data..." />
        )}

        <h2 className="attendance-title">
          {showPayroll ? "GeneratePay" : "Attendance Report"}
        </h2>

        <div className="filter-header-wrapper">
          {!showPayroll ? (
            <div className="date-range">
              <label className="select-label">From:</label>
              <input
                type="date"
                value={startDate.format("YYYY-MM-DD")}
                onChange={(e) => setStartDate(dayjs(e.target.value))}
                className="select-date"
              />
              <label className="select-label">To:</label>
              <input
                type="date"
                value={endDate.format("YYYY-MM-DD")}
                onChange={(e) => setEndDate(dayjs(e.target.value))}
                className="select-date"
              />
            </div>
          ) : (
            <div className="payroll-filters-section">
              <div className="payroll-top-filters">
                <div className="payroll-search-wrapper">
                  <input
                    type="text"
                    placeholder="Search employees by name or ID..."
                    className="payroll-search-input"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <div className="payroll-department-filter">
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="payroll-dropdown"
                  >
                    <option value="Manager">Manager</option>
                    <option value="HR">HR</option>
                    <option value="TL">TL</option>
                    <option value="Executive">Executive</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          <div className="btn-block">
            <button
              className="generate-payroll-btn"
              onClick={() => {
                setDepartment("Manager"); // Reset to Manager on toggle
                setShowPayroll(!showPayroll);
              }}
            >
              {showPayroll ? "Back To Attendance" : "Process Payroll"}
            </button>
          </div>
        </div>

        {!showPayroll ? (
          <div className="table-wrapper">
            <table className="attendance-table">
              <thead>
                <tr>
                  <th className="sticky-col">Executive</th>
                  {dates.map((date) => (
                    <th key={date}>
                      <div className="date-cell">
                        <span className="day">{dayjs(date).format("ddd")}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {attendanceData.map((exec) => (
                  <tr key={exec.executiveId}>
                    <td className="sticky-col">
                      {exec.executiveId} {exec.executiveName}
                    </td>
                    {dates.map((date) => {
                      const status = isFutureDate(date)
                        ? ""
                        : exec.attendance[date];
                      return (
                        <td key={date}>
                          {status && (
                            <span
                              className={`status-badge ${
                                status === "Present" ? "present" : "absent"
                              }`}
                            >
                              {status === "Present" ? "P" : "A"}
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="payroll-table-wrapper">
            <p className="payroll-subtitle">
              Manage employee salaries based on attendance and leave data.
            </p>
            <table className="payroll-table">
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Designation</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center", padding: "1rem" }}>
                      No employees found for selected filters.
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((emp) => (
                    <tr key={emp.id}>
                      <td>{emp.id}</td>
                      <td>{emp.name || emp.username || "N/A"}</td>
                      <td>{emp.email}</td>
                      <td>{emp.jobTitle || "N/A"}</td>
                      <td>{emp.role || "N/A"}</td>
                      <td>
                        <button
                          className="payroll-generate-slip"
                          onClick={() =>
                            alert(`Payroll slip generated for ${emp.name || emp.username}`)
                          }
                        >
                          Generate Slip
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceTable;