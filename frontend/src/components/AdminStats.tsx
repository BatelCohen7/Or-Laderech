import React from 'react';
import { Card } from './ui';

interface StatItem {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  change?: string;
}

interface AdminStatsProps {
  stats: StatItem[];
  className?: string;
}

export const AdminStats: React.FC<AdminStatsProps> = ({ stats, className = '' }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {stats.map((stat, index) => (
        <div key={index} className="transform hover:-translate-y-1 transition-transform duration-300">
          <Card key={index} hover className="p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-neutral-900">{stat.value}</p>
                {stat.change && (
                  <p className={`text-sm font-semibold mt-1 ${stat.color}`}>
                    {stat.change}
                  </p>
                )}
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bgColor}`}>
                {stat.icon}
              </div>
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default AdminStats;