import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  doctors: [],
  pendingDoctors: [],
  loading: false,
  error: null,
};

const doctorSlice = createSlice({
  name: 'doctors',
  initialState,
  reducers: {
    getDoctorsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getDoctorsSuccess: (state, action) => {
      state.loading = false;
      state.doctors = action.payload;
    },
    getDoctorsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    getPendingDoctorsSuccess: (state, action) => {
      state.loading = false;
      state.pendingDoctors = action.payload;
    },
    approveDoctorSuccess: (state, action) => {
      // Remove the approved doctor from the pending list
      state.pendingDoctors = state.pendingDoctors.filter(
        (doctor) => doctor._id !== action.payload.doctorId
      );
    },
  },
});

export const {
  getDoctorsStart,
  getDoctorsSuccess,
  getDoctorsFailure,
  getPendingDoctorsSuccess,
  approveDoctorSuccess
} = doctorSlice.actions;

export default doctorSlice.reducer;