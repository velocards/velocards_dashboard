import { VeloCardsLogo } from "@/components/icons/VeloCardsLogo";

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800">
      <VeloCardsLogo width={80} height={60} className="mb-4 animate-pulse" />
      <div className="loader">
        <svg viewBox="25 25 50 50">
          <circle r="20" cy="50" cx="50"></circle>
        </svg>
      </div>
    </div>
  );
};

export default Loading;
