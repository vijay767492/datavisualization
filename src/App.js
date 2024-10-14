import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Doughnut, Line, Radar } from 'react-chartjs-2';
import 'chart.js/auto'; 
import './App.css';

function App() {
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = async () => {
    try {
      const response = await axios.get('http://localhost:8081/api/sales'); 
      setSalesData(response.data);
    } catch (error) {
      console.error('Error fetching sales data:', error);
    }
  };

  const getRegionData = () => {
    const regions = {};
    salesData.forEach(sale => {
      regions[sale.region] = (regions[sale.region] || 0) + sale.totalSales;
    });
    return {
      labels: Object.keys(regions),
      datasets: [
        {
          label: 'Total Sales by Region',
          data: Object.values(regions),
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        },
      ],
    };
  };

  const getProductData = () => {
    const products = {};
    salesData.forEach(sale => {
      products[sale.product] = (products[sale.product] || 0) + sale.unitsSold;
    });
    return {
      labels: Object.keys(products),
      datasets: [
        {
          label: 'Units Sold by Product',
          data: Object.values(products),
          backgroundColor: '#42A5F5',
        },
      ],
    };
  };

  const getSalesTrendData = () => {
    const salesTrend = {};
    salesData.forEach(sale => {
      const date = new Date(sale.invoiceDate).toLocaleDateString();
      salesTrend[date] = (salesTrend[date] || 0) + sale.totalSales;
    });
    return {
      labels: Object.keys(salesTrend),
      datasets: [
        {
          label: 'Total Sales Over Time',
          data: Object.values(salesTrend),
          borderColor: '#FF6384',
          fill: false,
        },
      ],
    };
  };

  const getProfitMarginData = () => {
    const marginData = salesData.map(sale => sale.operatingMargin);
    const profitData = salesData.map(sale => sale.operatingProfit);
    return {
      labels: salesData.map(sale => sale.product),
      datasets: [
        {
          label: 'Operating Margin (%)',
          data: marginData,
          backgroundColor: 'rgba(255, 206, 86, 0.6)',
          borderColor: '#FFCE56',
          pointBackgroundColor: '#FFCE56',
        },
        {
          label: 'Operating Profit ($)',
          data: profitData,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: '#36A2EB',
          pointBackgroundColor: '#36A2EB',
        },
      ],
    };
  };

  return (
    <div className="App">
      <h1>Sales Data Visualization</h1>

      <div className="chart-container">
        {/* Doughnut Chart: Total Sales by Region */}
        <div className="small-chart">
          <h2>Total Sales by Region</h2>
          <Doughnut data={getRegionData()} />
        </div>

        {/* Bar Chart: Units Sold by Product */}
        <div className="chart">
          <h2>Units Sold by Product</h2>
          <Bar data={getProductData()} />
        </div>
      </div>

      {/* Line Chart: Total Sales Over Time */}
      <h2>Total Sales Over Time</h2>
      <Line data={getSalesTrendData()} />

      {/* Radar Chart: Operating Profit and Margin by Product */}
      <div className="fullscreen-chart">
        <h2>Operating Profit and Margin by Product</h2>
        <Radar data={getProfitMarginData()} />
      </div>
    </div>
  );
}

export default App;
