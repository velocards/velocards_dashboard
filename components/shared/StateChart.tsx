"use client";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});
const StateChart = ({
  color,
  height = 90,
}: {
  color: string;
  height?: number;
}) => {
  const options: ApexOptions = {
    chart: {
      height: "100%",
      type: "area",
      sparkline: {
        enabled: true,
      },
      toolbar: {
        show: false,
      },
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
      },
    },
    grid: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 1,
    },
    series: [
      {
        name: "Series 1",
        data: [
          40, 42, 35, 38, 52, 17, 15, 19, 29, 35, 30, 40, 35, 45, 35, 29, 38,
          51, 56, 48, 53, 57, 69, 65, 53, 39, 53, 38, 52, 51, 49, 50, 36, 63,
          90, 72, 75, 89, 96, 72, 91, 83, 71, 61, 52, 45, 49,
        ],
      },
    ],
    tooltip: {
      enabled: false,
    },
    colors: [color],
    fill: {
      colors: [color],
      opacity: 1,
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "vertical",
        shadeIntensity: 0.3,
        gradientToColors: undefined,
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 0.1,
        stops: [0, 90, 100],
        colorStops: [],
      },
    },
    xaxis: {
      tooltip: {
        enabled: false,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: false,
      },
    },
    yaxis: {
      tooltip: {
        enabled: false,
        // followCursor: true
      },
      labels: {
        show: false,
      },
    },
  };

  return (
    <div>
      <ReactApexChart
        options={options}
        series={options.series}
        type="area"
        height={height}
        width={120}
      />
    </div>
  );
};

export default StateChart;
