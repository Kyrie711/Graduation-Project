import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/idl';

interface UserState {
  user: User;
}

const initialState: UserState = {
  user: {
    username: '',
  },
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
  },
});

export const { setUser } = authSlice.actions;

export default authSlice.reducer;
