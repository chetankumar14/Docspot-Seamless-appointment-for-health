import { createSlice } from '@reduxjs/toolkit';

// Get user info from local storage
const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

const initialState = {
  userInfo: userInfoFromStorage,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      // Include username in the stored credentials
      state.userInfo = {
        _id: action.payload._id,
        name: action.payload.name,
        username: action.payload.username, // Added username
        email: action.payload.email,
        role: action.payload.role,
        isApproved: action.payload.isApproved,
        token: action.payload.token,
      };
      localStorage.setItem('userInfo', JSON.stringify(state.userInfo));
    },
    logout: (state) => {
      state.userInfo = null;
      localStorage.removeItem('userInfo');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
