import React from 'react';

const StatCard = ({ title, value, icon, change, changeType }) => {
  return (
    <div className="bg-white rounded-lg shadow p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          
          {change && (
            <div className={`flex items-center mt-2 text-sm ${
              changeType === 'increase' ? 'text-green-600' : 'text-red-600'
            }`}>
              <span>
                {changeType === 'increase' ? '↑' : '↓'} {change}
              </span>
              <span className="ml-1">vs last month</span>
            </div>
          )}
        </div>
        <div className="bg-indigo-100 rounded-full p-3">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
