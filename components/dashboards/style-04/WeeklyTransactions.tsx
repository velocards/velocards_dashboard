"use client";
import OptionsHorizontal from "@/components/shared/OptionsHorizontal";
import { useLayout } from "@/utils/LayoutContext";
import { ApexOptions } from "apexcharts";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const WeeklyTransactions = () => {
  const { theme } = useTheme();
  const { dir } = useLayout();
  const chartData: ApexOptions = {
    series: [44, 55, 41, 17, 15],
    chart: {
      type: "donut",
    },
    fill: {
      colors: ["#5D69F4", "#20B757", "#FFC861", "#FF6161", "#775DD0"],
    },
    stroke: {
      colors: theme == "dark" ? ["#404A60"] : ["#EBECEF"],
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            value: {
              color: theme == "light" ? "#404A60" : "#EBECEF",
              fontSize: "14px",
              offsetY: 2,
            },
            total: {
              show: true,
              label: "Bank",
              fontSize: "20px",
              color: theme == "light" ? "#404A60" : "#EBECEF",
              formatter: () => "Transactions",
            },
          },
        },
      },
    },
    legend: {
      position: "bottom",
      itemMargin: {
        vertical: 8,
        horizontal: 20,
      },
      horizontalAlign: "center",
      labels: {
        colors: theme == "light" ? "#404A60" : "#EBECEF",
      },
      markers: {
        width: 5,
        height: 5,
        offsetX: dir == "rtl" ? 5 : -5,
      },
    },
    labels: ["Completed", "In Progress", "Yet to Start", "Pending", "Canceled"],
    dataLabels: {
      style: {
        fontSize: "10px",
        fontWeight: 400,
      },
    },
  };
  return (
    <div className="box mb-4 xxl:mb-6">
      <div className="flex flex-wrap justify-between items-center gap-3 pb-4 lg:pb-6 mb-4 lg:mb-6 bb-dashed">
        <p className="font-medium">Weekly Transactions</p>
        <OptionsHorizontal />
      </div>
      <ReactApexChart
        height={330}
        width={"100%"}
        series={chartData.series}
        options={chartData}
        type="donut"
      />
    </div>
  );
};

export default WeeklyTransactions;
