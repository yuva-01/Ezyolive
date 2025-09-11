import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAppointments, reset } from '../../features/appointments/appointmentSlice';
import { 
  CalendarIcon, 
  PlusIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';

const AppointmentList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { appointments, isLoading, isError, message } = useSelector(
    (state) => state.appointments
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentView, setCurrentView] = useState('list'); // 'list' or 'calendar'

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (!user) {
      navigate('/login');
      return;
    }

    dispatch(getAppointments());

    return () => {
      dispatch(reset());
    };
  }, [user, navigate, isError, message, dispatch]);

  // Filter appointments
  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch = 
      appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || appointment.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

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

  // Get status badge color
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage and schedule patient appointments
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            to="/appointments/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            New Appointment
          </Link>
        </div>
      </div>

      <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-md">
        <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex-1 min-w-0 mt-2 sm:mt-0">
              <div className="max-w-lg flex rounded-md shadow-sm">
                <div className="relative flex-grow focus-within:z-10">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    type="text"
                    className="block w-full rounded-none rounded-l-md pl-10 sm:text-sm border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Search appointments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  className="-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  <span className="ml-2">Filter</span>
                </button>
              </div>
            </div>
            
            <div className="mt-4 sm:mt-0 sm:ml-4">
              <div className="flex items-center">
                <select
                  id="status"
                  name="status"
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All statuses</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="in-progress">In Progress</option>
                </select>
                <div className="ml-4 flex">
                  <button
                    type="button"
                    className={`${
                      currentView === 'list'
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'bg-white text-gray-500'
                    } inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                    onClick={() => setCurrentView('list')}
                  >
                    <span>List</span>
                  </button>
                  <button
                    type="button"
                    className={`${
                      currentView === 'calendar'
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'bg-white text-gray-500'
                    } ml-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                    onClick={() => setCurrentView('calendar')}
                  >
                    <CalendarIcon className="-ml-0.5 mr-2 h-4 w-4" />
                    <span>Calendar</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {currentView === 'list' ? (
          <ul className="divide-y divide-gray-200">
            {filteredAppointments.length === 0 ? (
              <li className="px-6 py-4 text-center text-gray-500">No appointments found</li>
            ) : (
              filteredAppointments.map((appointment) => (
                <li key={appointment._id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <CalendarIcon className="h-10 w-10 rounded-full text-gray-400" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {appointment.patientName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDate(appointment.date)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          appointment.status
                        )}`}
                      >
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </span>
                      <div className="ml-6">
                        <Link
                          to={`/appointments/${appointment._id}/edit`}
                          className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                        >
                          Edit
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="text-sm text-gray-500">
                        <span className="font-medium text-gray-700">Reason:</span>{' '}
                        {appointment.reason}
                      </p>
                    </div>
                    <div className="mt-2 sm:mt-0">
                      <p className="text-sm text-gray-500">
                        <span className="font-medium text-gray-700">Doctor:</span>{' '}
                        {appointment.doctorName}
                      </p>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        ) : (
          <div className="px-6 py-8">
            <p className="text-center text-gray-500">Calendar view coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentList;
