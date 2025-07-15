const CircularProgressBar = ({
  percentage,
  strokeWidth,
  radius,
}: {
  percentage: number;
  strokeWidth: number;
  radius: number;
}) => {
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <svg height={radius * 2} width={radius * 2}>
      <circle
        stroke="#d1d1d1"
        fill="transparent"
        strokeWidth={strokeWidth}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <circle
        stroke="#5a67d8"
        fill="transparent"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference + " " + circumference}
        style={{ strokeDashoffset }}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy=".3em"
        fontSize="16"
        fill="#5a67d8">
        {percentage}%
      </text>
    </svg>
  );
};

export default CircularProgressBar;
