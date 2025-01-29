import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import 'chartjs-adapter-moment';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ChartDataProps {
  dates: Date[];
  values: number[];
}

const TrendGraph = ({ chartData }: { chartData: ChartDataProps }) => {
  const [activeTab, setActiveTab] = useState("12 months");
  const [filteredData, setFilteredData] = useState({ labels: chartData.dates, values: chartData.values });

  useEffect(() => {
    let filtered = chartData;
    const now = new Date();

    if (activeTab === "12 months") {
      filtered = chartData;
    } else if (activeTab === "30 Days") {
      const cutoff = new Date();
      cutoff.setDate(now.getDate() - 30);
      filtered = filterDataByDate(cutoff);
    } else if (activeTab === "7 Days") {
      const cutoff = new Date();
      cutoff.setDate(now.getDate() - 7);
      filtered = filterDataByDate(cutoff);
    } else if (activeTab === "24 hours") {
      const cutoff = new Date();
      cutoff.setDate(now.getDate() - 1);
      filtered = filterDataByDate(cutoff);
    }

    setFilteredData({ labels: filtered.dates, values: filtered.values });
  }, [activeTab, chartData]);

  const filterDataByDate = (cutoffDate: Date) => {
    const filteredDates: Date[] = [];
    const filteredValues: number[] = [];

    chartData.dates.forEach((date, index) => {
      const currentDate = new Date(date);
      if (currentDate >= cutoffDate) {
        filteredDates.push(date);
        filteredValues.push(chartData.values[index]);
      }
    });

    return { dates: filteredDates, values: filteredValues };
  };

  const data = {
    labels: filteredData.labels,
    datasets: [
      {
        label: "Data",
        data: filteredData.values,
        backgroundColor: "#8b5cf6",
        borderRadius: 8,
        barThickness: 15,
      },
    ],
  };

  //console.log(data)

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        type: 'time',
        time: {
            unit: activeTab === "12 months" ? 'day' : activeTab === "30 Days" ? 'day' : activeTab === "7 Days" ? 'minute' : 'minute',
            
            displayFormats: {
              day: 'YYYY-MM-DD',
              minute: 'HH:mm:ss'
          }
        },
        
      },
      y: {
        grid: {
          color: "#f3f4f6",
        },
        ticks: {
          stepSize: 5,
        },
      },
    },
  };

  const tabs = ["12 months", "30 Days", "7 Days", "24 hours"];

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-xl shadow-md">
      <h2 className="text-lg font-bold">Trend Graph</h2>
      

      {/* Tabs */}
      <div className="flex border-b mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 text-sm font-medium py-2 border-b-2 transition-colors duration-300 ${
              activeTab === tab
                ? "text-purple-600 border-purple-600"
                : "text-gray-400 border-transparent"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default TrendGraph;
