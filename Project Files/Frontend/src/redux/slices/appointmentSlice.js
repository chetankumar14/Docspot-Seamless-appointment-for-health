import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  appointments: [],
  loading: false,
  error: null,
};

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    getAppointmentsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getAppointmentsSuccess: (state, action) => {
      state.loading = false;
      state.appointments = action.payload;
    },
    getAppointmentsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    bookAppointmentSuccess: (state, action) => {
      state.appointments.push(action.payload);
    },
    updateAppointmentStatusSuccess: (state, action) => {
      const index = state.appointments.findIndex(app => app._id === action.payload._id);
      if (index !== -1) {
        state.appointments[index] = action.payload;
      }
    },
  },
});

export const {
  getAppointmentsStart,
  getAppointmentsSuccess,
  getAppointmentsFailure,
  bookAppointmentSuccess,
  updateAppointmentStatusSuccess,
} = appointmentSlice.actions;

export default appointmentSlice.reducer;