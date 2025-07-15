"use client";
import Select from "@/components/shared/Select";
import { ApexOptions } from "apexcharts";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { useState } from "react";
const options = ["Last Weeks", "Last Month", "Last Year"];
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});
const series = [
  {
    name: "This Years",
    data: [0, 100, 30, 165, 85, 205, 105, 245, 75, 225, 150, 230],
  },
  {
    name: "Last Years",
    data: [0, 60, 24, 88, 50, 112, 57, 130, 36, 108, 70, 120],
  },
];

const PaymentOverviewChart = () => {
  const [selected, setSelected] = useState(options[0]);
  const { theme } = useTheme();
  const chartData: ApexOptions = {
    chart: {
      height: 289,
      type: "area",
      toolbar: {
        show: false,
      },
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      lineCap: "round",
      width: 2,
      dashArray: [5, 0],
      colors: ["#FFC861", "#20B757"],
    },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
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
      max: 300,
      tickAmount: 5,
      labels: {
        formatter: function (v) {
          return v + "";
        },
        style: {
          colors: theme == "light" ? "#404A60" : "#EBECEF",
        },
      },
    },
    legend: {
      show: false,
    },
    colors: ["#FFC861", "#20B757"],
    fill: {
      type: "gradient",
      colors: ["rgba(255, 200, 97, 0.21)", "rgba(32, 183, 87, 0.21)"],
      gradient: {
        shadeIntensity: 1,
        shade: theme == "dark" ? "dark" : "light",
        opacityFrom: 0.7,
        opacityTo: 0.9,
        stops: [0, 100],
      },
    },
    responsive: [
      {
        breakpoint: 1820,
        options: {
          chart: {
            height: 340,
          },
        },
      },
      {
        breakpoint: 1600,
        options: {
          chart: {
            height: 308,
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
            height: 250,
          },
        },
      },
      {
        breakpoint: 400,
        options: {
          chart: {
            height: 200,
          },
        },
      },
    ],
    grid: {
      borderColor: theme == "dark" ? "#404A60" : "#EBECEF",
    },
  };
  return (
    <div className="col-span-12 md:col-span-7 xxl:col-span-8 box overflow-x-hidden">
      <div className="flex flex-wrap justify-between items-center gap-3 pb-4 lg:pb-6 mb-4 lg:mb-6 bb-dashed">
        <p className="font-medium">Deposit Overview</p>
        <div className="flex items-center gap-2">
          <p className="text-xs sm:text-sm md:text-base">Sort By : </p>
          <Select selected={selected} setSelected={setSelected} items={options} contentClass="w-full" />
        </div>
      </div>
      <ReactApexChart height={330} width={"100%"} series={series} options={chartData} type="area" />
    </div>
  );
};

export default PaymentOverviewChart;
