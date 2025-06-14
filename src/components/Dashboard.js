import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';
import Header from './Header';

const Dashboard = () => {
  const [users, setUsers] = useState([]); // State to store fetched users
  const [loading, setLoading] = useState(false); // State for loading status
  const [error, setError] = useState(null); // State for error handling
  const [totalSales, setTotalSales] = useState(0); // State to store total sales (initialized to 0)
  const [ordersToday, setOrdersToday] = useState(0); // State to store total orders today
  const [pendingOrders, setPendingOrders] = useState(0); // State to store pending orders today
  const [totalStaff, setTotalStaff] = useState(0); // State to store total sales (initialized to 0)
  const [adminKey, setAdminKey] = useState(''); // State to store admin key input

  // Dummy data for users, sales, orders, etc.
  const dummyUsers = [
    { name: 'John Doe', email: 'john@nu.edu.pk', password: 'password123', role: 'admin' },
    { name: 'Jane Smith', email: 'jane@nu.edu.pk', password: 'password456', role: 'staff' },
    { name: 'Alice Johnson', email: 'alice@nu.eu.pk', password: 'password789', role: 'staff' },
  ];

  const dummyTotalSales = 15000.75;
  const dummyOrdersToday = 35;
  const dummyPendingOrders = 5;
  const dummyTotalStaff = 10;

  // Simulate loading and fetching data with dummy values
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setUsers(dummyUsers);  // Set users with dummy data
      setTotalSales(dummyTotalSales);  // Set total sales
      setOrdersToday(dummyOrdersToday);  // Set orders today
      setPendingOrders(dummyPendingOrders);  // Set pending orders
      setTotalStaff(dummyTotalStaff);  // Set total staff
      setLoading(false);  // Stop loading after 1 second delay
    }, 1000);
  }, []);

  // Function to handle canceling orders (this seems like an unused function here)
  const handleCancelOrder = (orderId) => {
    alert(`Order #${orderId} has been canceled.`);
    // Add logic to remove/update the scheduled order if necessary
  };

  // Function to mask the password with asterisks
  const maskPassword = (password) => {
    return password ? '*'.repeat(password.length) : ''; // Return masked password as a string of asterisks
  };

  // Function to handle user removal
  const handleRemoveUser = async (email) => {
    if (adminKey === '123') { // Check if the admin key matches
      try {
        // Remove the user from the local state after successful deletion
        setUsers(users.filter(user => user.email !== email)); // Filter out the deleted user by email
        alert('User removed successfully');
      } catch (err) {
        console.error("Error:", err); // Log the error for debugging
        setError('Failed to remove user');
      }
    } else {
      alert('Invalid admin key!'); // Show alert if the admin key is incorrect
    }
  };

  return (
    <div>
      <Header />

      <div className="dashboard">
        {/* Analytics Section */}
        <div className="section">
          <h2>Analytics</h2>
          <div className="analytics">
            <div className="analytics-card">
              <h3>Total Sales</h3>
              <p>${totalSales.toFixed(2)}</p>
            </div>
            <div className="analytics-card">
              <h3>Orders Today</h3>
              <p>{ordersToday}</p>
            </div>
            <div className="analytics-card">
              <h3>Pending Orders</h3>
              <p>{pendingOrders}</p>
            </div>
            <div className="analytics-card">
              <h3>Total Staff</h3>
              <p>{totalStaff}</p>
            </div>
          </div>
        </div>

        {/* Users Table Section */}
        <div className="section">
          <div className="users-section">
            <div className="users-sections s1">
              <h2>Users</h2>
            </div>
            <div className="users-sections s2">
              <input 
                type="text" 
                placeholder="Admin Key" 
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)} 
              />
            </div>
          </div>
          {loading ? (
            <p>Loading users...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <table className="users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Password</th>
                  <th>Role</th>
                  <th>Actions</th> {/* New Actions column */}
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user.email}> {/* Use email as key to avoid conflicts */}
                    <td>{index + 1}</td> {/* Dynamically incrementing ID based on index */}
                    <td>{user.name}</td> {/* Display name from response */}
                    <td>{user.email}</td>
                    <td>{maskPassword(user.password)}</td> {/* Display the masked password */}
                    <td>{user.role}</td>
                    <td>
                      <button onClick={() => handleRemoveUser(user.email)}>Remove</button> {/* Remove button */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <footer>
        <p>&copy; 2024 Restaurant POS System</p>
      </footer>
    </div>
  );
};

export default Dashboard;
