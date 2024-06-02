import axios from 'axios';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Stock } from '@/idl';

interface StockState {
  value: Stock[];
}

const initialState: StockState = {
  value: [],
};

export const fetchStockList = createAsyncThunk(
  'stock/fetchStockList',
  async () => {
    const response = await axios.get('http://localhost:3000/stock');
    return response.data;
  }
);

export const stockSlice = createSlice({
  name: 'stock',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(
      fetchStockList.fulfilled,
      (state, action: PayloadAction<Stock[]>) => {
        state.value = action.payload;
      }
    );
  },
});

export default stockSlice.reducer;
