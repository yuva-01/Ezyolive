import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ehrService from './ehrService';

const initialState = {
  patients: [],
  patient: null,
  records: [],
  record: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Get all patients
export const getPatients = createAsyncThunk(
  'ehr/getAllPatients',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await ehrService.getPatients(token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get patient by ID
export const getPatient = createAsyncThunk(
  'ehr/getPatient',
  async (patientId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await ehrService.getPatient(patientId, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create new patient
export const createPatient = createAsyncThunk(
  'ehr/createPatient',
  async (patientData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await ehrService.createPatient(patientData, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get patient records
export const getPatientRecords = createAsyncThunk(
  'ehr/getPatientRecords',
  async (patientId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await ehrService.getPatientRecords(patientId, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const ehrSlice = createSlice({
  name: 'ehr',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPatients.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPatients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.patients = action.payload;
      })
      .addCase(getPatients.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getPatient.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPatient.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.patient = action.payload;
      })
      .addCase(getPatient.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createPatient.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createPatient.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.patients.push(action.payload);
      })
      .addCase(createPatient.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getPatientRecords.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPatientRecords.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.records = action.payload;
      })
      .addCase(getPatientRecords.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = ehrSlice.actions;
export default ehrSlice.reducer;
