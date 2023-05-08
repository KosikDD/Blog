import { createSlice } from '@reduxjs/toolkit';

const dataSlice = createSlice({
  name: 'data',
  initialState: {
    Data: [],
    Page: 1,
  },
  reducers: {
    getDataArticle(state, action) {
      state.Data = action.payload;
    },
    getPage(state, action) {
      state.Page = action.payload;
    },
  },
});

export const { getPage, getDataArticle } = dataSlice.actions;

export default dataSlice.reducer;
