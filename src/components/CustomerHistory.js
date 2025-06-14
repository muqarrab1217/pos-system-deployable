import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./CustomerHistory.css";
import Header from "./Header";

const CustomerHistory = () => {
  const [customerHistory, setCustomerHistory] = useState({});  // To store the fetched data
  const [searchTerm, setSearchTerm] = useState("");  // To store the search term
  const [loading, setLoading] = useState(false);  // To handle loading state
  const [error, setError] = useState(null);  // To handle errors

  // Function to format date in the desired format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,  // Use 12-hour clock
    };
    return date.toLocaleString('en-GB', options).replace(',', '');  // 'en-GB' for UK format
  };

  // Dummy data
  const dummyData = [
    {
      customerNumber: '1234567890',
      orders: [
        {
          orderId: 1,
          items: 'Item A, Item B',
          totalAmount: 50.75,
          date: '2025-02-15T14:30:00',
        },
        {
          orderId: 2,
          items: 'Item C, Item D',
          totalAmount: 32.50,
          date: '2025-02-16T10:00:00',
        },
      ],
    },
    {
      customerNumber: '0987654321',
      orders: [
        {
          orderId: 3,
          items: 'Item E, Item F',
          totalAmount: 22.00,
          date: '2025-02-14T16:45:00',
        },
        {
          orderId: 4,
          items: 'Item G, Item H',
          totalAmount: 18.30,
          date: '2025-02-17T12:15:00',
        },
      ],
    },
    {
      customerNumber: '5555555555',
      orders: [
        {
          orderId: 5,
          items: 'Item I, Item J',
          totalAmount: 40.20,
          date: '2025-02-15T18:30:00',
        },
        {
          orderId: 6,
          items: 'Item K, Item L',
          totalAmount: 25.90,
          date: '2025-02-16T09:15:00',
        },
      ],
    },
  ];

  // Fetch and set the dummy data instead of making an API call
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {  // Simulate a delay for loading state
      const groupedData = dummyData.reduce((acc, customer) => {
        acc[customer.customerNumber] = customer.orders;
        return acc;
      }, {});
      setCustomerHistory(groupedData);  // Set the grouped data into state
      setLoading(false);
    }, 1000);
  }, []);

  // Filter customer data based on the search term
  const filteredCustomerHistory = Object.keys(customerHistory).filter((customerNumber) =>
    customerNumber.toLowerCase().includes(searchTerm.toLowerCase())  // Case insensitive search
  );

  if (loading) {
    return <div>Loading...</div>;  // Display loading state
  }

  if (error) {
    return <div>Error: {error}</div>;  // Display error if there was an issue with the fetch
  }

  return (
    <div className="customer-history-container">
      <Header />

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by Customer Number"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}  // Update search term as user types
        />
      </div>

      {/* Customer Orders Table */}
      <div className="customer-history-table">
        <table>
          <thead>
            <tr>
              <th>Customer Phone Number</th>
              <th>Order ID</th>
              <th>Items</th>
              <th>Total Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomerHistory.length > 0 ? (
              filteredCustomerHistory.map((customerNumber) => {
                const orders = customerHistory[customerNumber];
                
                // Ensure orders is an array before calling .map
                if (Array.isArray(orders)) {
                  return orders.map((order) => (
                    <tr key={order.orderId}>
                      <td>{customerNumber}</td>
                      <td>{order.orderId}</td>
                      <td>{order.items}</td>
                      <td>${order.totalAmount.toFixed(2)}</td>
                      <td>{formatDate(order.date)}</td>  {/* Use the formatDate function here */}
                    </tr>
                  ));
                } else {
                  return (
                    <tr key={customerNumber}>
                      <td colSpan={5}>No orders found for customer {customerNumber}</td>
                    </tr>
                  );
                }
              })
            ) : (
              <tr>
                <td colSpan={5}>No orders found for this customer number.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerHistory;
