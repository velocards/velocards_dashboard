"use client";
import Select from "@/components/shared/Select";
import { options } from "@/public/data/timesDropdown";
import useWindowSize from "@/utils/useWindowSize";
import { ApexOptions } from "apexcharts";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { balanceApi } from "@/lib/api/balance";
import AddBalance from "@/components/shared/AddBalance";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const DepositsOverview = () => {
  const [selected, setSelected] = useState(options[0]);
  const { theme } = useTheme();
  const { windowSize } = useWindowSize();
  const [isLoading, setIsLoading] = useState(false);
  const [realDepositData, setRealDepositData] = useState<any>(null);
  const [isAddBalanceOpen, setIsAddBalanceOpen] = useState(false);

  // Fetch real deposit data from balance history
  const fetchDepositData = async () => {
    try {
      setIsLoading(true);
      const currentYear = new Date().getFullYear();
      const { data } = await balanceApi.getBalanceHistory({
        startDate: `${currentYear}-01-01`,
        endDate: `${currentYear}-12-31`,
        type: 'deposit',
        limit: 1000
      });

      // Process the deposit data for chart visualization
      const depositTransactions = data.transactions || [];
      setRealDepositData(depositTransactions);
    } catch (error) {
      setRealDepositData([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchDepositData();
  }, []);

  // Generate demo data for inspiration overlay
  const getDemoDataForPeriod = (period: string) => {
    switch (period) {
      case "Days":
        return {
          categories: Array.from({length: 30}, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (29 - i));
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          }),
          series: [
            { 
              name: "Crypto Deposits", 
              type: "area", 
              data: [0, 150, 220, 180, 340, 290, 420, 380, 520, 480, 650, 720, 580, 790, 850, 920, 680, 1100, 1250, 980, 1400, 1320, 1580, 1750, 1420, 1890, 2100, 1980, 2250, 2400]
            }
          ]
        };
      case "Weeks":
        return {
          categories: Array.from({length: 12}, (_, i) => `Week ${i + 1}`),
          series: [
            { 
              name: "Crypto Deposits", 
              type: "area", 
              data: [1200, 1850, 2100, 2650, 3200, 2890, 3400, 3950, 4200, 3800, 4500, 5200]
            }
          ]
        };
      case "Months":
      default:
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const currentMonth = new Date().getMonth();
        return {
          categories: monthNames.slice(0, currentMonth + 1),
          series: [
            { 
              name: "Crypto Deposits", 
              type: "area", 
              data: [2500, 3200, 2800, 4100, 3600, 4800, 5200, 4900, 5800, 6200, 5600, 7100].slice(0, currentMonth + 1)
            }
          ]
        };
    }
  };

  // Generate chart data based on real deposit data
  const getDataForPeriod = (period: string) => {
    if (!realDepositData || isLoading) {
      // Return empty data while loading
      return {
        categories: [],
        series: [
          { name: "Crypto Deposits", type: "area", data: [] },
        ]
      };
    }

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    
    switch (period) {
      case "Days":
        // Group deposits by day for the last 30 days
        const dailyData = [];
        const dailyCategories = [];
        
        for (let i = 29; i >= 0; i--) {
          const date = new Date(currentDate);
          date.setDate(currentDate.getDate() - i);
          dailyCategories.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
          
          const dayStart = new Date(date.setHours(0, 0, 0, 0));
          const dayEnd = new Date(date.setHours(23, 59, 59, 999));
          
          const dayDeposits = realDepositData.filter((tx: any) => {
            try {
              const txDate = new Date(tx.createdAt || tx.created_at);
              return txDate >= dayStart && txDate <= dayEnd;
            } catch (error) {
              return false;
            }
          });
          
          // Sum all crypto deposits for this day
          const totalAmount = dayDeposits.reduce((sum: number, tx: any) => sum + (tx.amount || 0), 0);
          dailyData.push(totalAmount);
        }
        
        return {
          categories: dailyCategories,
          series: [
            { name: "Crypto Deposits", type: "area", data: dailyData },
          ]
        };
        
      case "Weeks":
        // Group deposits by week
        const weeklyData = [];
        const weeklyCategories = [];
        const weeksToShow = Math.min(25, Math.ceil((currentDate.getTime() - new Date(currentYear, 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000)));
        
        for (let i = weeksToShow - 1; i >= 0; i--) {
          const weekEnd = new Date(currentDate);
          weekEnd.setDate(currentDate.getDate() - (i * 7));
          const weekStart = new Date(weekEnd);
          weekStart.setDate(weekEnd.getDate() - 6);
          
          weeklyCategories.push(`Week ${weeksToShow - i}`);
          
          const weekDeposits = realDepositData.filter((tx: any) => {
            try {
              const txDate = new Date(tx.createdAt || tx.created_at);
              return txDate >= weekStart && txDate <= weekEnd;
            } catch (error) {
              return false;
            }
          });
          
          // Sum all crypto deposits for this week
          const totalAmount = weekDeposits.reduce((sum: number, tx: any) => sum + (tx.amount || 0), 0);
          weeklyData.push(totalAmount);
        }
        
        return {
          categories: weeklyCategories,
          series: [
            { name: "Crypto Deposits", type: "area", data: weeklyData },
          ]
        };
        
      case "Months":
      default:
        // Group deposits by month for the current year
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthlyCategories = monthNames.slice(0, currentMonth + 1);
        const monthlyData = [];
        
        for (let i = 0; i <= currentMonth; i++) {
          const monthStart = new Date(currentYear, i, 1);
          const monthEnd = new Date(currentYear, i + 1, 0, 23, 59, 59, 999);
          
          const monthDeposits = realDepositData.filter((tx: any) => {
            try {
              const txDate = new Date(tx.createdAt || tx.created_at);
              return txDate >= monthStart && txDate <= monthEnd;
            } catch (error) {
              return false;
            }
          });
          
          // Sum all crypto deposits for this month
          const totalAmount = monthDeposits.reduce((sum: number, tx: any) => sum + (tx.amount || 0), 0);
          monthlyData.push(totalAmount);
        }
        
        return {
          categories: monthlyCategories,
          series: [
            { name: "Crypto Deposits", type: "area", data: monthlyData },
          ]
        };
    }
  };

  const currentData = getDataForPeriod(selected);
  const demoData = getDemoDataForPeriod(selected);
  
  // Check if we have any real data
  const hasRealData = currentData.series.length > 0 && currentData.series[0].data.length > 0 && 
                      currentData.series[0].data.some(value => value > 0);
  
  // Use real data if available, otherwise use demo data for the inspiring overlay
  const displayData = hasRealData ? currentData : demoData;
  const series = displayData.series;
  const chartData: ApexOptions = {
    chart: {
      width: "100%",
      height: 350,
      type: "area",
      toolbar: {
        show: false,
      },
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
      },
      offsetY: 10,
      offsetX: 0,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 3,
      colors: ["#20B757"],
      curve: "smooth",
    },
    fill: {
      colors: ["#20B757"],
      opacity: 0.3,
    },

    legend: {
      show: false,
    },
    xaxis: {
      categories: displayData.categories,
      labels: {
        style: {
          colors: theme == "light" ? "#404A60" : "#EBECEF",
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        color: theme == "dark" ? "#404A60" : "#EBECEF",
      },
    },
    yaxis: {
      min: 0,
      labels: {
        offsetX: -40,
        show: windowSize! > 768 ? true : false,
        style: {
          colors: theme == "light" ? "#404A60" : "#EBECEF",
        },
        formatter: function(value: number) {
          return '$' + value.toFixed(0);
        }
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
    colors: ["#20B757"],
    responsive: [
      {
        breakpoint: 1500,
        options: {
          chart: {
            height: 320,
          },
        },
      },
      {
        breakpoint: 992,
        options: {
          chart: {
            height: 350,
          },
        },
      },
      {
        breakpoint: 570,
        options: {
          chart: {
            height: 280,
          },
        },
      },
    ],
    grid: {
      borderColor: theme == "dark" ? "#404A60" : "#EBECEF",
      padding: {
        left: -20,
        top: 20,
        bottom: 20,
        right: 20,
      },
    },
  };
  return (
    <div className="box overflow-hidden h-[500px]">
      <div className="flex flex-wrap justify-between items-center gap-3 pb-4 lg:pb-6 mb-4 lg:mb-6 bb-dashed">
        <p className="font-medium">Deposits Overview</p>
        <div className="flex items-center gap-2">
          <p className="text-xs sm:text-sm md:text-base">Sort By : </p>
          <Select selected={selected} setSelected={setSelected} items={options} />
        </div>
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center h-[350px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Loading deposit data...</p>
          </div>
        </div>
      ) : (
        <div className="relative">
          {/* Chart - blurred if no real data */}
          <div className={!hasRealData ? "filter blur-sm" : ""}>
            <ReactApexChart height={350} width={"100%"} options={chartData} series={series} type="area" />
          </div>
          
          {/* Inspiring overlay when no real data */}
          {!hasRealData && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <div className="text-center max-w-md px-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="las la-credit-card text-3xl text-white"></i>
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                  Start Using Virtual Cards
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Make your first crypto deposit to see beautiful analytics like this. Track your crypto deposits and fund your virtual cards.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button 
                    onClick={() => setIsAddBalanceOpen(true)}
                    className="inline-flex items-center gap-2 bg-primary text-white hover:bg-primary/90 px-6 py-2.5 rounded-full font-medium text-sm transition-colors shadow-sm"
                  >
                    <i className="las la-plus text-base"></i>
                    <span>Add Balance</span>
                  </button>
                  <button 
                    onClick={() => window.location.href = '/help/deposits'}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 dark:text-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium text-sm"
                  >
                    <i className="las la-question-circle text-base"></i>
                    Learn How
                  </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                  Preview shows sample data • Start depositing to see your real analytics
                </p>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Add Balance Modal */}
      <AddBalance 
        open={isAddBalanceOpen} 
        toggleOpen={() => setIsAddBalanceOpen(!isAddBalanceOpen)} 
      />
    </div>
  );
};

export default DepositsOverview;