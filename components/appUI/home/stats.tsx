import { stats } from "@/app/constants/global";

const Stats: React.FC = () => {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {stats.map((stat, index) => (
          <div key={index}>
            <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-slate-500">{stat.label}</div>
          </div>
        ))}
      </div>
    );
  };
  
  export default Stats;