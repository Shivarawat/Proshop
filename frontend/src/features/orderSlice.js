import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  loading: true,
  success: false,
  order: null,
  error: null,
  orderPay: {},
  loadingPay: false,
  successPay: false,
  myOrders: [],
  errorMyOrders: null,
  loadingMyOrders: false,
  allOrders: [],
  loadingDeliver: false,
  successDeliver: false,
  errorDeliver: null
};

export const payOrder = createAsyncThunk(
  'order/payOrder',
  async ({ id: orderId, paymentResult }, thunkAPI) => {
    try {
      // console.log('PAYORDER ORDERSLICE', orderId, paymentResult);
      const userInfo = thunkAPI.getState().user.userInfo;
      // console.log('userinfo inside orderslice', userInfo);
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/orders/${orderId}/pay`,
        paymentResult,
        config
      );
      // console.log('dataaa inside payorder', data);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const deliverOrder = createAsyncThunk(
  'order/deliverOrder',
  async (order, thunkAPI) => {
    try {
      const userInfo = thunkAPI.getState().user.userInfo;
      // console.log('DELIVERORDER ORDERSLICE', order._id, userInfo.token);
      
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/orders/${order._id}/deliver`,{},
        config
      );
      // console.log('deliverOrder returned data', data);
      return data;
    } catch (error) {
      // console.log('deliver order failed');
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const listMyOrders = createAsyncThunk(
  'order/getMyOrders',
  async (_, thunkAPI) => {
    try {
      const userInfo = thunkAPI.getState().user.userInfo;
      // console.log('orderSlice ListMyOrdes', userInfo.token);
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.get('/api/orders/myorders', config);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const listAllOrders = createAsyncThunk(
  'order/getAllOrders',
  async (_, thunkAPI) => {
    try {
      const userInfo = thunkAPI.getState().user.userInfo;
      // console.log('orderSlice ListMyOrdes', userInfo.token);
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.get('/api/orders', config);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (order, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.user.userInfo.token;

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.post('/api/orders', order, config);

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getOrderDetails = createAsyncThunk(
  'order/getOrderDetails',
  async (id, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.user.userInfo.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.get(`/api/orders/${id}`, config);
      // console.log('GET ORDER DETAILS', data);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    payReset: (state, action) => {
      state.loadingPay = false;
      state.successPay = false;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(createOrder.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.order = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getOrderDetails.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(payOrder.pending, (state, action) => {
        state.loadingPay = true;
        state.successPay = false;
        // console.log('PAYORDER PENDING', action.payload);
      })
      .addCase(payOrder.fulfilled, (state, action) => {
        state.loadingyPay = false;
        state.successPay = true;
        state.orderPay = action.payload;
        // console.log('PAYORDER FULFILLED', action.payload);
      })
      .addCase(payOrder.rejected, (state, action) => {
        // console.log('ACTION REJECTED', action.payload);
      })
      .addCase(listMyOrders.pending, (state, action) => {
        state.loadingMyOrders = true;
      })
      .addCase(listMyOrders.fulfilled, (state, action) => {
        state.loadingMyOrders = false;
        state.myOrders = action.payload;
      })
      .addCase(listMyOrders.rejected, (state, action) => {
        state.loadingMyOrders = false;
        state.error = action.payload;
        // console.log('List My Orders is Rejected');
      })
      .addCase(listAllOrders.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        // console.log('listallorders pending');
      })
      .addCase(listAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.allOrders = action.payload;
        // console.log('listallorders ', action.payload);
      })
      .addCase(listAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // console.log('listallorders rejected', action.payload);
      })
      .addCase(deliverOrder.pending, (state, action) => {
        state.loadingDeliver = true;
        state.successDeliver = false;
      })
      .addCase(deliverOrder.fulfilled, (state, action) => {
        state.loadingDeliver = false;
        state.successDeliver = true;
      })
      .addCase(deliverOrder.rejected, (state, action) => {
        state.loadingDeliver = false;
        // console.log(action.payload)
        state.errorDeliver = action.payload;
      });
  },
});

export const { payReset } = orderSlice.actions;
export default orderSlice.reducer;
