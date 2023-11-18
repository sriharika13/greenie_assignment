import React, { useState, useEffect } from "react";
import "./App.css";
import { AccountCreation } from "./components/AccountCreation";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  creation_date: string;
}

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<string[]>([]); // Track selected rows. array of string bcoz id is string
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tab, setTab] = useState(1);
  const [successMsg, setSuccessMsg]= useState('')
  const rowsPerPage = 5;

  useEffect(() => {
    setIsLoading(true);
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
        setIsLoading(false);
      });
  }, []);

  const handleDelete = (id: string) => {
    const updatedUsers = users.filter((user) => user.id !== id);
    setUsers(updatedUsers);
  };

  const toggleSelectAll = () => {
    if (selectedRows.length === paginatedData.length) {
      // All rows are selected, so deselect all
      setSelectedRows([]);
    } else {
      // Select all displayed rows
      setSelectedRows(paginatedData.map((user) => user.id));
    }
  };

  const generateDate = () => {
    const today = new Date();
    const year = today.getFullYear(); // Get the year
    const month = today.getMonth() + 1; // Get the month (months are zero-indexed)
    const day = today.getDate(); // Get the day of the month

    // Format the date as needed (for example, YYYY-MM-DD)
    const formattedDate = `${year}-${month < 10 ? "0" + month : month}-${
      day < 10 ? "0" + day : day
    }`;
    return formattedDate;
  };

  const isRowSelected = (id: string) => selectedRows.includes(id);
  // Calculate the total number of pages based on the filtered data
  const totalPages = Math.ceil(
    users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.id.toString().includes(searchQuery) ||
        generateDate().toLowerCase().includes(searchQuery.toLowerCase())
    ).length / rowsPerPage
  );

  // Get the current page of data to display
  const paginatedData = users
    .filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.id.toString().includes(searchQuery) ||
        generateDate().toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage); // -1 bcoz users array index starts with 0

  const handleDeleteSelected = () => {
    const updatedUsers = users.filter(
      (user) => !selectedRows.includes(user.id)
    );
    setUsers(updatedUsers);
    setSelectedRows([]); // Clear selected rows after delete
  };

  const toggleSelectRow = (id: string) => {
    if (isRowSelected(id)) {
      // Deselect the row
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      // Select the row
      setSelectedRows([...selectedRows, id]);
    }
  };

  const toggleOverlay = () => {
    setSuccessMsg('')
    setIsOverlayVisible(!isOverlayVisible);
  };

  return (
    <div className="main-container">
      <div >
      <button className="btn btn-primary" onClick={()=>setTab(1)}>
          User Details Tab
        </button>
        <button className="btn" style={{backgroundColor:'#EF5350', color:"white"}} onClick={()=> setTab(2)}>
          Account Creation Tab
        </button>
        
        </div>
      <header className="d-flex ">
        <div>
        <h2>{`${tab===1 ? 'Users List' : 'Add User'}`}</h2>
        <span>Home - User Management - Users</span>
        </div>
        
      </header>
      {tab===2 && (<AccountCreation/>)}
      {tab===1 && (
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control form-control-lg mb-2"
              placeholder="Search by name, email or role"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset to the first page when searching
              }}
            />
          </div>
          <div></div>
        </div>

        {isLoading ? (
          <div className="text-center my-auto">
            <div
              className="spinner-border custom-spinner text-primary"
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th style={{ fontWeight: "bold" }}>
                  <input
                    type="checkbox"
                    checked={selectedRows.length === paginatedData.length}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th style={{ fontWeight: "bold" }}>ID</th>
                <th style={{ fontWeight: "bold" }}>Name</th>
                <th style={{ fontWeight: "bold" }}>Email</th>
                <th style={{ fontWeight: "bold" }}>Phone</th>
                <th style={{ fontWeight: "bold" }}>Creation Date</th>
                <th style={{ fontWeight: "bold", width: "100px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((user) => (
                <tr
                  key={user.id}
                  className={`${isRowSelected(user.id) ? "table-active" : ""}`}
                >
                  <td>
                    <input
                      type="checkbox"
                      checked={isRowSelected(user.id)}
                      onChange={() => toggleSelectRow(user.id)}
                    />
                  </td>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{generateDate()}</td>

                  <td className="action-btns col-2">
                    <button
                      className="text-primary"
                      style={{ cursor: "pointer" }}
                      onClick={toggleOverlay}
                    >
                      save
                    </button>

                    <button
                      className="text-danger ms-1"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleDelete(user.id)}
                    >
                      delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination Buttons */}
        <div>
          <div className="row">
            <div className="col-md-2">
              {/* Delete Selected Button */}
              <button
                className="btn btn-danger rounded-pill fw-bold"
                onClick={() => handleDeleteSelected()}
                disabled={selectedRows.length === 0}
              >
                Delete Selected
              </button>
            </div>

            <div className="col-md-8 d-flex justify-content-center">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="btn btn-primary me-2"
              >
                First Page
              </button>
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="btn btn-primary me-2"
              >
                Previous Page
              </button>
              <span className="mt-2 me-2 text-custom fw-bold">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="btn btn-primary me-2"
              >
                Next Page
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="btn btn-primary me-2"
              >
                Last Page
              </button>
            </div>
          </div>
        </div>
        {isOverlayVisible && (
          <div className="overlay">
            <div className="overlay-content text-center">
              <h2>Generate Report!</h2>
              <p className="success">{successMsg}</p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "20px",
                }}
              >
                <button onClick={toggleOverlay} className="btn btn-secondary">
                  Close
                </button>
                <button className="btn btn-primary" onClick={()=>setSuccessMsg('Successfully generated report for the user!')}>Generate</button>
              </div>
            </div>
          </div>
        )}
      </div>
      )}

    </div>
    
  );
};

export default App;
