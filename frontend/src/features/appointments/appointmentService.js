import axios from 'axios';

const API_URL = '/api/appointments/';

const extractAppointments = (payload) => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.appointments)) return payload.appointments;
  if (Array.isArray(payload.data)) return payload.data;
  return [];
};

const extractAppointment = (payload) => {
  if (!payload) return null;
  if (payload.appointment) return payload.appointment;
  if (payload.data?.appointment) return payload.data.appointment;
  return payload;
};

// Get all appointments
const getAppointments = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL, config);

  return extractAppointments(response.data?.data);
};

// Create new appointment
const createAppointment = async (appointmentData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL, appointmentData, config);

  return extractAppointment(response.data?.data);
};

// Get single appointment
const getAppointment = async (appointmentId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL + appointmentId, config);

  return extractAppointment(response.data?.data);
};

// Update appointment
const updateAppointment = async (appointmentId, appointmentData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(API_URL + appointmentId, appointmentData, config);

  return extractAppointment(response.data?.data);
};

// Delete appointment
const deleteAppointment = async (appointmentId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.delete(API_URL + appointmentId, config);

  return extractAppointment(response.data?.data);
};

const appointmentService = {
  getAppointments,
  createAppointment,
  getAppointment,
  updateAppointment,
  deleteAppointment,
};

export default appointmentService;
