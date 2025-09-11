import React from 'react';

const AppointmentCard = ({ appointment, onClick }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div 
      className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onClick(appointment._id)}
    >
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium text-gray-900">{appointment.patientName}</h4>
          <p className="text-sm text-gray-600 mt-1">{formatDate(appointment.date)}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
        </span>
      </div>
      <div className="mt-3 pt-3 border-t border-gray-100">
        <p className="text-sm text-gray-700">
          <span className="font-medium">Reason:</span> {appointment.reason}
        </p>
        <p className="text-sm text-gray-700 mt-1">
          <span className="font-medium">Doctor:</span> {appointment.doctorName}
        </p>
      </div>
    </div>
  );
};

export default AppointmentCard;
