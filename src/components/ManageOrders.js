import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";  // Import jsPDF for PDF generation
import 'jspdf-autotable';
import axios from "axios";
import OrderTable from "./OrderTable";  // Import the reusable OrderTable component
import "./ManageOrders.css";
import Header from "./Header";

const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [activeCategory, setActiveCategory] = useState("completed");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);

  // Fetch orders from the backend when the component mounts
  useEffect(() => {
    fetchOrders();  // Fetch orders on mount
  }, []);

  // Function to fetch orders from the backend (dummy orders for now)
  const fetchOrders = () => {
    // Simulating dummy orders
    const dummyOrders = [
      {
        orderId: 1,
        staffName: 'John Doe',
        customerNumber: '1234567890',
        totalAmount: 20.5,
        orderDate: '2025-02-15T14:30:00',
        status: 'completed',
      },
      {
        orderId: 2,
        staffName: 'Jane Smith',
        customerNumber: '0987654321',
        totalAmount: 15.75,
        orderDate: '2025-02-15T15:30:00',
        status: 'pending',
      },
      {
        orderId: 3,
        staffName: 'Alice Brown',
        customerNumber: '5555555555',
        totalAmount: 30.0,
        orderDate: '2025-02-14T13:00:00',
        status: 'cancelled',
      },
      {
        orderId: 4,
        staffName: 'Bob White',
        customerNumber: '2222222222',
        totalAmount: 25.0,
        orderDate: '2025-02-16T16:30:00',
        status: 'completed',
      },
      {
        orderId: 5,
        staffName: 'Tom Green',
        customerNumber: '3333333333',
        totalAmount: 19.99,
        orderDate: '2025-02-17T09:00:00',
        status: 'pending',
      },
      {
        orderId: 6,
        staffName: 'Sarah Lee',
        customerNumber: '4444444444',
        totalAmount: 40.0,
        orderDate: '2025-02-13T18:00:00',
        status: 'completed',
      },
      {
        orderId: 7,
        staffName: 'Mike Harris',
        customerNumber: '7777777777',
        totalAmount: 12.5,
        orderDate: '2025-02-14T10:00:00',
        status: 'cancelled',
      },
      {
        orderId: 8,
        staffName: 'Rachel Adams',
        customerNumber: '6666666666',
        totalAmount: 55.0,
        orderDate: '2025-02-15T08:30:00',
        status: 'pending',
      },
      {
        orderId: 9,
        staffName: 'Chris Black',
        customerNumber: '8888888888',
        totalAmount: 60.0,
        orderDate: '2025-02-12T11:30:00',
        status: 'completed',
      },
      {
        orderId: 10,
        staffName: 'Lisa White',
        customerNumber: '9999999999',
        totalAmount: 28.0,
        orderDate: '2025-02-16T20:00:00',
        status: 'cancelled',
      },
      {
        orderId: 11,
        staffName: 'David Wilson',
        customerNumber: '1212121212',
        totalAmount: 18.25,
        orderDate: '2025-02-17T14:15:00',
        status: 'pending',
      },
      {
        orderId: 12,
        staffName: 'Olivia Davis',
        customerNumber: '3434343434',
        totalAmount: 22.5,
        orderDate: '2025-02-13T19:00:00',
        status: 'completed',
      },
    ];    
    
    setOrders(dummyOrders);  // Set dummy orders to state
  };

  useEffect(() => {
    // Check if orders is an array before applying filter
    if (Array.isArray(orders)) {
      const filtered = orders.filter(order => order.status === activeCategory);
      setFilteredOrders(filtered);
    } else {
      console.error('Orders is not an array:', orders);
      setFilteredOrders([]);  // In case orders is not an array, fallback to empty array
    }
  }, [orders, activeCategory]);

  // Handle change of start date for the report
  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  // Handle change of end date for the report
  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  // Function to filter orders by date range
  const filterOrdersByDateRange = (startDate, endDate) => {
    if (!startDate || !endDate) return orders;  // Return all orders if no date range selected

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Ensure the end date includes the full day by setting the time to 23:59:59
    end.setHours(23, 59, 59, 999);  // Setting the end time to the last moment of the day

    return orders.filter((order) => {
      const orderDate = new Date(order.orderDate);
      return orderDate >= start && orderDate <= end;
    });
  };

  // Define actions for the "Pending" category
  const actionsForPending = [
    {
      label: "Mark Completed",
      onClick: (orderId) => handleStatusChange(orderId, "completed"),
    },
    {
      label: "Cancel",
      onClick: (orderId) => handleStatusChange(orderId, "cancelled"),
    },
  ];

  // Define actions for the "Completed" category
  const actionsForCompleted = [
    {
      label: "Revert to Pending",
      onClick: (orderId) => handleStatusChange(orderId, "pending"),
    },
  ];

  // Define actions for the "Cancelled" category
  const actionsForCancelled = [
    {
      label: "Revert to Pending",
      onClick: (orderId) => handleStatusChange(orderId, "pending"),
    },
    {
      label: "Revert to Completed",
      onClick: (orderId) => handleStatusChange(orderId, "completed"),
    },
  ];

  // Determine which actions to show based on the active category
  let actions;
  if (activeCategory === "pending") {
    actions = actionsForPending;
  } else if (activeCategory === "completed") {
    actions = actionsForCompleted;
  } else if (activeCategory === "cancelled") {
    actions = actionsForCancelled;
  }

  // Function to handle status change (updating the order status)
  const handleStatusChange = (orderId, newStatus) => {
    // In this case, let's simulate the status change
    setOrders(orders.map(order =>
      order.orderId === orderId ? { ...order, status: newStatus } : order
    ));
    alert(`Order ${orderId} status changed to ${newStatus}`);
  };

  // Function to generate the PDF report
  const generatePDF = () => {
    const doc = new jsPDF();

    // Add Title
    doc.setFontSize(18);
    const pageWidth = doc.internal.pageSize.getWidth(); // Get the width of the page
    const textWidth = doc.getTextWidth("Sales Report"); // Get the width of the text
    const textX = (pageWidth - textWidth) / 2; // Calculate the X position to center the text
    doc.text("Sales Report", textX, 20); // Use the calculated X position

    doc.setFontSize(13);
    // Add Report Date
    const reportDate = new Date().toLocaleString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,  // 12-hour format (AM/PM)
    });
    
    doc.text(`Report Generated On: ${reportDate}`, 14, 30);

    // Add Date Range
    const formattedStartDate = new Date(startDate).toLocaleString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,  // 12-hour format
    });

    const formattedEndDate = new Date(endDate).toLocaleString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,  // 12-hour format
    });

    // Display the formatted date range
    doc.text(`Date Range: ${formattedStartDate} to ${formattedEndDate}`, 14, 40);

    // Filter Orders by Date Range
    const filteredOrdersByDate = filterOrdersByDateRange(startDate, endDate);

    // Completed Orders Table
    const completedOrders = filteredOrdersByDate.filter(order => order.status === "completed");
    doc.setFontSize(12);
    doc.text(`Completed Orders: ${completedOrders.length}`, 14, 50);
    doc.autoTable({
      startY: 60,
      head: [['Order ID', 'Staff Name', 'Customer Number', 'Total Amount', 'Order Date']],
      body: completedOrders.map(order => [
        order.orderId,
        order.staffName,
        order.customerNumber,
        order.totalAmount,
        new Date(order.orderDate).toLocaleString('en-GB', {
          day: 'numeric',
          month: 'long',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,  // 12-hour format (AM/PM)
        }),
      ]),
    });

    // Cancelled Orders Table
    const cancelledOrders = filteredOrdersByDate.filter(order => order.status === "cancelled");
    doc.text(`Cancelled Orders: ${cancelledOrders.length}`, 14, doc.lastAutoTable.finalY + 10);
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 20,
      head: [['Order ID', 'Staff Name', 'Customer Number', 'Total Amount', 'Order Date']],
      body: cancelledOrders.map(order => [
        order.orderId,
        order.staffName,
        order.customerNumber,
        order.totalAmount,
        new Date(order.orderDate).toLocaleString('en-GB', {
          day: 'numeric',
          month: 'long',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,  // 12-hour format (AM/PM)
        }),
      ]),
    });

    // Save the PDF
    doc.save("sales_report.pdf");
  };

  return (
    <div className="orders-container">
      <Header />

      {/* Category Buttons */}
      <div className="category-buttons scrollable-content">
        <button
          className={`category-button ${activeCategory === "completed" ? "active" : ""}`}
          onClick={() => setActiveCategory("completed")}
        >
          Completed
        </button>
        <button
          className={`category-button ${activeCategory === "pending" ? "active" : ""}`}
          onClick={() => setActiveCategory("pending")}
        >
          Pending
        </button>
        <button
          className={`category-button ${activeCategory === "cancelled" ? "active" : ""}`}
          onClick={() => setActiveCategory("cancelled")}
        >
          Cancelled
        </button>
      </div>

      {/* Date Range for Report Generation */}
      <div className="generate-report-section">
        <div className="date-range">
          <label>Start Date: </label>
          <input type="date" value={startDate} onChange={handleStartDateChange} />
        </div>
        <div className="date-range">
          <label>End Date: </label>
          <input type="date" value={endDate} onChange={handleEndDateChange} />
        </div>

        <button 
          className="button" 
          onClick={() => {
            if (!startDate || !endDate) {
              alert("Please select both start and end dates to generate the report.");
            } else {
              generatePDF(); // Call the generatePDF function if dates are valid
            }
          }}
        >
          Generate Report
        </button>
      </div>

      {/* Orders Table */}
      <div className="orders-table">
        <OrderTable
          orders={filteredOrders}  // Pass filtered orders based on active category
          actions={actions}  // Pass the actions for the active category
        />
      </div>
    </div>
  );
};

export default OrdersManagement;
