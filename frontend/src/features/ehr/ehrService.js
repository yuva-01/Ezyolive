import axios from 'axios';

const API_URL = '/api/ehr/';

// Get all patients
const getPatients = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL + 'patients', config);

  return response.data.data;
};

// Get patient by ID
const getPatient = async (patientId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL + 'patients/' + patientId, config);

  return response.data.data;
};

// Create new patient
const createPatient = async (patientData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL + 'patients', patientData, config);

  return response.data.data;
};

// Get patient records
const getPatientRecords = async (patientId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL + 'patients/' + patientId + '/records', config);

  return response.data.data;
};

const ehrService = {
  getPatients,
  getPatient,
  createPatient,
  getPatientRecords,
};

export default ehrService;
