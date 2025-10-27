const stats = [
  {
    icon: "✓",
    line1: "100% Free Forever",
    line2: "No Hidden Charges",
  },
  {
    icon: "⚡",
    line1: "2-Minute Setup",
    line2: "Start to Download",
  },
  {
    icon: "🔒",
    line1: "Privacy-First",
    line2: "No Sign-Up Required",
  },
  {
    icon: "⭐",
    line1: "Unlimited",
    line2: "Downloads",
  },
];

const Stats: React.FC = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
      {stats.map((stat, index) => (
        <div key={index}>
          <div className="text-3xl font-bold text-slate-800">{stat.icon}</div>
          <div className="font-semibold text-slate-700">{stat.line1}</div>
          <div className="text-sm text-slate-500">{stat.line2}</div>
        </div>
      ))}
    </div>
  );
};

export default Stats;