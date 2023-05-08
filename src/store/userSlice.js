import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'data',
  initialState: {
    Logedin: false,
    UserData: null,
    UserMail: null,
  },
  reducers: {
    setLogedin(state, action) {
      state.Logedin = action.payload;
    },
    getUserData(state, action) {
      state.UserData = action.payload;
    },
    getUserMail(state, action) {
      state.UserMail = action.payload;
    },
  },
});

export const { getUserData, getUserMail, setLogedin } = userSlice.actions;

export default userSlice.reducer;
