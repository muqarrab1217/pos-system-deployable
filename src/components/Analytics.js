import React, { useEffect, useState, useRef } from 'react';
import '../App.css';
import './Report.css';
import Header from "./Header"
import { Chart } from 'chart.js/auto';
import { jsPDF } from 'jspdf';

const App = () => {
  // State to store the top-selling items and top waiters (using dummy data)
  const [topSellingItems, setTopSellingItems] = useState([
    { itemName: 'Burger', totalOrders: 150 },
    { itemName: 'Pizza', totalOrders: 120 },
    { itemName: 'Ice Cream', totalOrders: 200 },
    { itemName: 'Orange Juice', totalOrders: 90 }
  ]);
  const [topWaiters, setTopWaiters] = useState([
    { staffName: 'John Doe', totalOrders: 350 },
    { staffName: 'Jane Smith', totalOrders: 300 },
    { staffName: 'James Brown', totalOrders: 250 },
    { staffName: 'Emily Clark', totalOrders: 200 }
  ]);

  // Refs for the chart elements
  const topSellingChartRef = useRef(null);
  const waiterOrdersChartRef = useRef(null);
  const topSellingChartInstance = useRef(null);
  const waiterOrdersChartInstance = useRef(null);
  const dailyWaiterAverageRef = useRef(null);
  const dailyWaiterAverageInstance = useRef(null);

  useEffect(() => {
    drawCharts();

    // Cleanup on component unmount
    return () => {
      if (topSellingChartInstance.current) {
        topSellingChartInstance.current.destroy();
      }
      if (waiterOrdersChartInstance.current) {
        waiterOrdersChartInstance.current.destroy();
      }
      if (dailyWaiterAverageInstance.current) {
        dailyWaiterAverageInstance.current.destroy();
      }
    };
  }, [topSellingItems]); // Re-run charts when top-selling items change

  const drawCharts = () => {
    // Destroy existing charts to prevent reinitialization issues
    if (topSellingChartInstance.current) {
      topSellingChartInstance.current.destroy();
    }
    if (waiterOrdersChartInstance.current) {
      waiterOrdersChartInstance.current.destroy();
    }
    if (dailyWaiterAverageInstance.current) {
      dailyWaiterAverageInstance.current.destroy();
    }

    // Top Selling Items Chart (Bar)
    const topSellingCtx = topSellingChartRef.current.getContext('2d');
    topSellingChartInstance.current = new Chart(topSellingCtx, {
      type: 'bar',
      data: {
        labels: topSellingItems.map((item) => item.itemName), // Using the dummy data
        datasets: [
          {
            label: 'Orders',
            data: topSellingItems.map((item) => item.totalOrders), // Using the dummy data
            backgroundColor: ['#00796b', '#004d40', '#e0f7fa', '#80cbc4', '#26a69a'],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
        },
      },
    });

    // Waiter Orders Chart (Pie) - Using `topWaiters` (dummy data)
    const waiterOrdersCtx = waiterOrdersChartRef.current.getContext('2d');
    waiterOrdersChartInstance.current = new Chart(waiterOrdersCtx, {
      type: 'pie',
      data: {
        labels: topWaiters.map((waiter) => waiter.staffName), // Using staffName for labels (from dummy data)
        datasets: [
          {
            label: 'Orders',
            data: topWaiters.map((waiter) => waiter.totalOrders), // Using totalOrders for data
            backgroundColor: ['#00796b', '#004d40', '#26a69a', '#80cbc4'],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
        },
      },
    });

    // Second Pie Chart - Waiters Who Took the Most Orders Chart (using same `topWaiters`)
    const dailyAverageCtx = dailyWaiterAverageRef.current.getContext('2d');
    dailyWaiterAverageInstance.current = new Chart(dailyAverageCtx, {
      type: 'pie',
      data: {
        labels: topWaiters.map((waiter) => waiter.staffName), // Same as first pie chart, use staffName for labels
        datasets: [
          {
            label: 'Orders',
            data: topWaiters.map((waiter) => waiter.totalOrders), // Same as first pie chart, use totalOrders
            backgroundColor: ['#00796b', '#004d40', '#26a69a', '#80cbc4'],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
        },
      },
    });
  };

  // Function to generate PDF for Top Selling Items
  const generateTopSellingReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Top Selling Food Items Report', 20, 20);
    doc.setFontSize(12);
    doc.text('Rank  Item Name           Orders', 20, 40);

    topSellingItems.forEach((item, index) => {
      const yPosition = 50 + index * 10;
      doc.text(`${index + 1}     ${item.itemName}         ${item.totalOrders}`, 20, yPosition);
    });

    doc.save('Top_Selling_Report.pdf');
  };

  // Function to generate PDF for Top Waiters
  const generateTopWaitersReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Top Waiters Report', 20, 20);
    doc.setFontSize(12);
    doc.text('Rank  Waiter Name        Orders', 20, 40);

    topWaiters.forEach((waiter, index) => {
      const yPosition = 50 + index * 10;
      doc.text(`${index + 1}     ${waiter.staffName}        ${waiter.totalOrders}`, 20, yPosition);
    });

    doc.save('Top_Waiters_Report.pdf');
  };

  return (
    <div className="App">
      <Header />

      <main className="report-main">
        <h2>Charts</h2>
        <section className="chart-section">
          <div className="bar-chart">
            <canvas ref={topSellingChartRef} id="topSellingChart"></canvas>
          </div>
          <div className="chart-box">
            <canvas ref={waiterOrdersChartRef} id="waiterOrdersChart"></canvas>
          </div>
          <div className="chart-box">
            <canvas ref={dailyWaiterAverageRef} id="waiterOrdersChart"></canvas>
          </div>
        </section>

        <section className="report-section">
          <div className="report-container">
            <div className="report">
              <h2>Top Selling Food Items</h2>
            </div>
            <div className="generate-report">
              <button className="checkout-button" onClick={generateTopSellingReport}>
                Generate Report
              </button>
            </div>
          </div>

          <table className="report-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Food Item</th>
                <th>Orders</th>
              </tr>
            </thead>
            <tbody>
              {topSellingItems.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.itemName}</td>
                  <td>{item.totalOrders}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="report-section">
          <div className="report-container">
            <div className="report">
              <h2>Waiters Who Took the Most Orders</h2>
            </div>
            <div className="generate-report">
              <button className="checkout-button" onClick={generateTopWaitersReport}>
                Generate Report
              </button>
            </div>
          </div>
          <table className="report-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Waiter Name</th>
                <th>Orders</th>
              </tr>
            </thead>
            <tbody>
              {topWaiters.map((waiter, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{waiter.staffName}</td>
                  <td>{waiter.totalOrders}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>

      <footer>
        <p>&copy; 2024 Restaurant POS System</p>
      </footer>
    </div>
  );
};

export default App;
