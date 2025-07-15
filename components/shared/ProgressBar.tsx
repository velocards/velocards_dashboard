"use client";
import { useEffect, useRef, useState } from "react";
import CountUp from "react-countup";

type progressTypes = {
  title: string;
  bg: string;
  percent: number;
  width: string;
  color: string;
};

const ProgressBar = ({ progressData }: { progressData: progressTypes[] }) => {
  const [isInView, setIsInview] = useState(false);
  const progress = useRef<HTMLUListElement | null>(null);
  useEffect(() => {
    const progressBars = Array.from(
      document.getElementsByClassName("bar") as HTMLCollectionOf<HTMLElement>
    );
    const observer = new IntersectionObserver(function (items) {
      items.forEach(function (item) {
        if (item.isIntersecting) {
          setIsInview(true);
        }
      });
    });
    for (const progressBar of progressBars) {
      observer.observe(progressBar);
    }
    // Clean up the observer when the component unmounts
    return () => {
      for (const progressBar of progressBars) {
        observer.unobserve(progressBar);
      }
    };
  }, []);
  return (
    <ul ref={progress} className="flex flex-col gap-5 lg:gap-[30px]">
      {progressData.map(({ bg, width, percent, title, color }) => (
        <li key={title}>
          <div className="mb-2 flex items-center justify-between">
            <span className="inline-block shrink-0 text-title">{title}</span>
            <span className={`inline-block shrink-0 ${color}`}>
              <CountUp end={percent} enableScrollSpy={true} />%
            </span>
          </div>
          <div className={`bar h-2 rounded-full bg-opacity-20 ${bg}`}>
            <div
              className={` rounded-s-full ${width} ${bg} ${
                isInView && "progress-grow"
              } h-2`}></div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ProgressBar;
