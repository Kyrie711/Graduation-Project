import { configureStore } from '@reduxjs/toolkit';
import stockReducer from './stock-slice';
import authReducer from './auth-slice';

const store = configureStore({
  reducer: {
    stock: stockReducer,
    auth: authReducer,
  },
});
export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
