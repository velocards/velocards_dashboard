"use client";
import { ApexOptions } from "apexcharts";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { transactionApi } from "@/lib/api/transactions";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const IncomeExpenseChart = () => {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [spendingData, setSpendingData] = useState<{
    thisMonth: number[];
    lastMonth: number[];
    threeMonthAvg: number[];
  }>({
    thisMonth: [],
    lastMonth: [],
    threeMonthAvg: []
  });

  // Generate demo spending data for inspiration overlay
  const getDemoSpendingData = () => {
    const daysInMonth = new Date().getDate();
    const thisMonthDemo: number[] = [];
    const lastMonthDemo: number[] = [];
    let cumulativeThis = 0;
    let cumulativeLast = 0;
    
    for (let i = 1; i <= daysInMonth; i++) {
      // Simulate realistic spending patterns
      const dailySpendingThis = Math.floor(Math.random() * 150) + 50; // $50-$200 daily
      const dailySpendingLast = Math.floor(Math.random() * 120) + 40; // $40-$160 daily
      
      cumulativeThis += dailySpendingThis;
      cumulativeLast += dailySpendingLast;
      
      thisMonthDemo.push(cumulativeThis);
      lastMonthDemo.push(cumulativeLast);
    }
    
    // 3-month average
    const avgDemo = thisMonthDemo.map((current, index) => {
      const lastValue = lastMonthDemo[index] || 0;
      return (current + lastValue) / 2;
    });
    
    return {
      thisMonth: thisMonthDemo,
      lastMonth: lastMonthDemo,
      threeMonthAvg: avgDemo
    };
  };

  // Fetch real spending data
  const fetchSpendingData = async () => {
    try {
      setIsLoading(true);
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      
      // Get current month data (day by day)
      const thisMonthStart = new Date(currentYear, currentMonth, 1);
      const thisMonthEnd = new Date(currentYear, currentMonth + 1, 0);
      
      // Get last month data
      const lastMonthStart = new Date(currentYear, currentMonth - 1, 1);
      const lastMonthEnd = new Date(currentYear, currentMonth, 0);
      
      // Fetch transactions for current and last month
      const [thisMonthTx, lastMonthTx] = await Promise.all([
        transactionApi.getTransactions({
          fromDate: thisMonthStart.toISOString().split('T')[0],
          toDate: thisMonthEnd.toISOString().split('T')[0],
          limit: 1000
        }),
        transactionApi.getTransactions({
          fromDate: lastMonthStart.toISOString().split('T')[0],
          toDate: lastMonthEnd.toISOString().split('T')[0],
          limit: 1000
        })
      ]);

      // Process this month's data by day
      const daysInMonth = thisMonthEnd.getDate();
      const thisMonthData = [];
      let cumulativeSpending = 0;
      
      for (let day = 1; day <= daysInMonth; day++) {
        const dayStart = new Date(currentYear, currentMonth, day, 0, 0, 0);
        const dayEnd = new Date(currentYear, currentMonth, day, 23, 59, 59);
        
        const dayTransactions = thisMonthTx.data.transactions?.filter((tx: any) => {
          try {
            const txDate = new Date(tx.createdAt || tx.created_at);
            return txDate >= dayStart && txDate <= dayEnd && 
                   (tx.status === 'completed' || tx.status === 'captured');
          } catch (error) {
            return false;
          }
        }) || [];
        
        const daySpending = dayTransactions.reduce((sum: number, tx: any) => sum + (tx.amount || 0), 0);
        cumulativeSpending += daySpending;
        thisMonthData.push(Math.max(0, cumulativeSpending)); // Ensure no negative values
      }

      // Process last month's data by day
      const daysInLastMonth = lastMonthEnd.getDate();
      const lastMonthData: number[] = [];
      cumulativeSpending = 0;
      
      for (let day = 1; day <= daysInLastMonth; day++) {
        const dayStart = new Date(currentYear, currentMonth - 1, day, 0, 0, 0);
        const dayEnd = new Date(currentYear, currentMonth - 1, day, 23, 59, 59);
        
        const dayTransactions = lastMonthTx.data.transactions?.filter((tx: any) => {
          try {
            const txDate = new Date(tx.createdAt || tx.created_at);
            return txDate >= dayStart && txDate <= dayEnd && 
                   (tx.status === 'completed' || tx.status === 'captured');
          } catch (error) {
            return false;
          }
        }) || [];
        
        const daySpending = dayTransactions.reduce((sum: number, tx: any) => sum + (tx.amount || 0), 0);
        cumulativeSpending += daySpending;
        lastMonthData.push(Math.max(0, cumulativeSpending)); // Ensure no negative values
      }

      // Calculate 3-month average (simplified - using current and last month average)
      const avgData = thisMonthData.map((current, index) => {
        const lastValue = lastMonthData[index] || 0;
        return (current + lastValue) / 2;
      });

      setSpendingData({
        thisMonth: thisMonthData,
        lastMonth: lastMonthData,
        threeMonthAvg: avgData
      });
    } catch (error) {
      console.error('Failed to fetch spending data:', error);
      // Keep empty arrays on error
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchSpendingData();
  }, []);

  // Create series from real data
  const series = [
    {
      name: 'This Month',
      data: spendingData.thisMonth
    },
    {
      name: 'Last Month', 
      data: spendingData.lastMonth
    },
    {
      name: '3-Month Average',
      data: spendingData.threeMonthAvg
    }
  ];
  
  const chartData: ApexOptions = {
    chart: {
      height: 280,
      type: 'area',
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      },
      offsetY: 0,
      offsetX: 0,
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    colors: ['#4371E9', '#FFC861', '#20B757'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 90, 100]
      }
    },
    xaxis: {
      categories: Array.from({length: Math.max(spendingData.thisMonth.length, 30)}, (_, i) => i + 1),
      labels: {
        style: {
          colors: theme == "light" ? "#404A60" : "#EBECEF",
        },
        formatter: function(value: string) {
          return value;
        }
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: theme == "light" ? "#404A60" : "#EBECEF",
        },
        formatter: function(value: number) {
          return '$' + value.toLocaleString();
        }
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      labels: {
        colors: theme == "light" ? "#404A60" : "#EBECEF",
      }
    },
    grid: {
      borderColor: theme == "dark" ? "#404A60" : "#EBECEF",
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: false
        }
      },
      padding: {
        left: -20,
        top: 20,
        bottom: 20,
        right: 20,
      },
    },
    tooltip: {
      theme: theme == "dark" ? "dark" : "light",
      y: {
        formatter: function(value: number) {
          return '$' + value.toLocaleString();
        }
      }
    },
    responsive: [
      {
        breakpoint: 1500,
        options: {
          chart: {
            height: 260,
          },
        },
      },
      {
        breakpoint: 992,
        options: {
          chart: {
            height: 280,
          },
        },
      },
      {
        breakpoint: 570,
        options: {
          chart: {
            height: 240,
          },
        },
      },
    ],
  };

  // Calculate percentage changes
  const currentTotal = series[0].data[series[0].data.length - 1] || 0;
  const lastMonthTotal = series[1].data[series[1].data.length - 1] || 0;
  const avgTotal = series[2].data[series[2].data.length - 1] || 0;
  
  const vsLastMonth = lastMonthTotal > 0 ? ((currentTotal - lastMonthTotal) / lastMonthTotal * 100).toFixed(1) : '0.0';
  const vsAverage = avgTotal > 0 ? ((currentTotal - avgTotal) / avgTotal * 100).toFixed(1) : '0.0';

  return (
    <div className="box overflow-hidden h-[500px]">
      <div className="flex flex-wrap justify-between items-center gap-3 pb-4 lg:pb-6 mb-4 lg:mb-6 bb-dashed">
        <p className="font-medium">Spending Overview</p>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-[350px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Loading spending data...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">vs Last Month</p>
              <p className={`text-lg font-semibold ${Number(vsLastMonth) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {Number(vsLastMonth) > 0 ? '+' : ''}{vsLastMonth}%
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">vs 3-Month Avg</p>
              <p className={`text-lg font-semibold ${Number(vsAverage) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {Number(vsAverage) > 0 ? '+' : ''}{vsAverage}%
              </p>
            </div>
          </div>
          
          {spendingData.thisMonth.length > 0 && (
            <ReactApexChart height={280} width={"100%"} series={series} options={chartData} type="area" />
          )}
          
          {spendingData.thisMonth.length === 0 && !isLoading && (
            <div className="flex items-center justify-center h-[280px] text-gray-500">
              <p>No spending data available for this period</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default IncomeExpenseChart;