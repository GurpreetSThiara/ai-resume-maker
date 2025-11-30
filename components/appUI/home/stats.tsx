import { Shield, Zap, Lock, Star, TrendingUp, Clock, Users, Download } from "lucide-react";

const stats = [
  {
    icon: Shield,
    line1: "100% Free Forever",
    line2: "No Hidden Charges",
    color: "from-green-500 to-emerald-600",
    bgColor: "from-green-50 to-emerald-50",
  },
  {
    icon: Clock,
    line1: "2-Minute Setup",
    line2: "Start to Download",
    color: "from-blue-500 to-indigo-600",
    bgColor: "from-blue-50 to-indigo-50",
  },
  {
    icon: Lock,
    line1: "Privacy-First",
    line2: "No Sign-Up Required",
    color: "from-purple-500 to-pink-600",
    bgColor: "from-purple-50 to-pink-50",
  },
  {
    icon: Download,
    line1: "Unlimited",
    line2: "Downloads",
    color: "from-orange-500 to-red-600",
    bgColor: "from-orange-50 to-red-50",
  },
];

const Stats: React.FC = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div 
            key={index} 
            className="group relative overflow-hidden rounded-2xl bg-linear-to-br p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/50 backdrop-blur-sm"
            style={{
              backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
            }}
          >
            <div className={`absolute inset-0 bg-linear-to-br ${stat.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            
            <div className="relative z-10">
              <div className={`inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-xl bg-linear-to-r ${stat.color} shadow-lg mb-3 md:mb-4 transform group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
              </div>
              <div className="font-bold text-slate-800 text-sm md:text-base mb-1">{stat.line1}</div>
              <div className="text-xs md:text-sm text-slate-600 font-medium">{stat.line2}</div>
            </div>
            
            <div className="absolute -top-2 -right-2 w-20 h-20 bg-linear-to-br from-white/20 to-transparent rounded-full blur-xl" />
          </div>
        );
      })}
    </div>
  );
};

export default Stats;