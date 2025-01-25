import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  filter: 'all', // 'all' | 'completed' | 'incomplete'
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
  },
});

export const { setFilter } = todosSlice.actions;
export default todosSlice.reducer;