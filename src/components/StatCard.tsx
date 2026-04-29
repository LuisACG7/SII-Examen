export const StatCard = ({ label, value, color, textColor = "text-black" }: { label: string, value: string | number, color: string, textColor?: string }) => (
  <div className={`bg-white p-6 rounded-2xl shadow-sm border-b-4 ${color} flex flex-col items-center transition-transform hover:scale-105`}>
    <p className="text-gray-400 text-xs uppercase font-bold mb-1">{label}</p>
    <h3 className={`text-3xl font-black ${textColor}`}>{value}</h3>
  </div>
);