import { createSlice } from '@reduxjs/toolkit';

const subredditsSlice = createSlice({
  name: 'subreddits',
  initialState: [],
  reducers: {
    setSubreddits: (state, action) => {
      return action.payload;
    },
  },
});

export const { setSubreddits } = subredditsSlice.actions;
export default subredditsSlice.reducer;
