import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import userReducer from './features/users/userSlice';
import appointmentReducer from './features/appointments/appointmentSlice';
import ehrReducer from './features/ehr/ehrSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    appointments: appointmentReducer,
    ehr: ehrReducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
