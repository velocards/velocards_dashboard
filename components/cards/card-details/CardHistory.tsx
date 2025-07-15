"use client";
import Select from "@/components/shared/Select";
import { useLayout } from "@/utils/LayoutContext";
import useWindowSize from "@/utils/useWindowSize";
import { ApexOptions } from "apexcharts";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { useState } from "react";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});
const options = ["Last Weeks", "Last Month", "Last Year"];
const CardHistory = () => {
  const [selected, setSelected] = useState(options[0]);
  const { theme } = useTheme();
  const { windowSize } = useWindowSize();
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
              fontSize: "16px",
              offsetY: 2,
            },
            total: {
              show: true,
              label: "Card",
              fontSize: "24px",
              color: theme == "light" ? "#404A60" : "#EBECEF",
              formatter: () => "Transaction",
            },
          },
        },
      },
    },
    legend: {
      position: windowSize! > 1400 ? "right" : "bottom",
      itemMargin: {
        vertical: windowSize! > 1500 ? 4 : 2,
      },
      offsetY: windowSize! > 1830 ? 40 : windowSize! > 1700 ? 20 : 0,
      horizontalAlign: "center",
      labels: {
        colors: theme == "light" ? "#404A60" : "#EBECEF",
      },
      markers: {
        width: 8,
        height: 8,
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
    <div className="box">
      <div className="flex flex-wrap justify-between items-center gap-3 pb-4 lg:pb-6 mb-4 lg:mb-6 bb-dashed">
        <h4 className="h4">History</h4>
        <div className="flex items-center gap-2">
          <h4 className="text-xs sm:text-sm md:text-base">Sort By : </h4>
          <Select selected={selected} setSelected={setSelected} items={options} contentClass="w-full" />
        </div>
      </div>
      <ReactApexChart height={330} width={"100%"} series={chartData.series} options={chartData} type="donut" />
    </div>
  );
};

export default CardHistory;
