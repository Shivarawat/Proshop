import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const PRODUCTS_URL = '/api/products';

const initialState = {
  products: [],
  topProducts: [],
  status: 'idle', //'idle' | 'loading' | 'success' | 'failed'
  error: null,
  product: {},
  productStatus: 'idle',
  productError: null,
  successDelete: false,
  createdProduct: {},
  successCreate: false,
  uploading: false,
  reviews: [],
  errorProductReview: null,
  successProductReview: false,
  pages: 1,
  page: null,
};

export const fetchTopProducts = createAsyncThunk(
  'products/fetchTopProducts',
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get('/api/products/top');
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ keyword = '', pageNumber = '' }, thunkAPI) => {
    let response;
    try {
      response = await axios.get(
        `/api/products?keyword=${keyword}&pageNumber=${pageNumber}`
      );
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProducts',
  async (id, thunkAPI) => {
    try {
      const userInfo = thunkAPI.getState().user.userInfo;
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      await axios.delete(`/api/products/${id}`, config);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (product, thunkAPI) => {
    try {
      const userInfo = thunkAPI.getState().user.userInfo;
      const config = {
        headers: {
          // 'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.post(`${PRODUCTS_URL}`, {}, config);
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const createProductReview = createAsyncThunk(
  'products/createProductReview',
  async ({ id, rating, comment }, thunkAPI) => {
    try {
      const userInfo = thunkAPI.getState().user.userInfo;
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.post(
        `${PRODUCTS_URL}/${id}/reviews`,
        { rating: rating, comment: comment },
        config
      );
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async (product, thunkAPI) => {
    try {
      console.log('update product', product);
      const userInfo = thunkAPI.getState().user.userInfo;
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.put(
        `${PRODUCTS_URL}/${product._id}`,
        product,
        config
      );
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const fetchSingleProduct = createAsyncThunk(
  'products/fetchSingleProduct',
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${PRODUCTS_URL}/${id}`);
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    createProductReset: (state, action) => {
      state.successCreate = false;
      state.createdProduct = {};
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchProducts.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'success';
        console.log(action.payload);
        state.products = action.payload.products;
        state.pages = action.payload.pages;
        state.page = action.payload.page;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchSingleProduct.pending, (state, action) => {
        state.productStatus = 'loading';
      })
      .addCase(fetchSingleProduct.fulfilled, (state, action) => {
        state.productStatus = 'success';
        state.product = { ...action.payload };
      })
      .addCase(fetchSingleProduct.rejected, (state, action) => {
        state.productStatus = 'failed';
        state.productError = action.payload;
      })
      .addCase(deleteProduct.pending, (state, action) => {
        state.successDelete = false;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.successDelete = true;
      })
      .addCase(createProduct.pending, (state, action) => {
        state.successCreate = false;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.successCreate = true;
        state.createdProduct = action.payload;
        state.products.push(action.payload);
      })
      .addCase(createProductReview.rejected, (state, action) => {
        state.errorProductReview = action.payload;
      })
      .addCase(fetchTopProducts.fulfilled, (state, action) => {
        state.topProducts = action.payload;
      });
  },
});

export const selectAllProducts = (state) => state.product.products;
export const getProductsStatus = (state) => state.product.status;
export const getProductsError = (state) => state.product.error;

export const { createProductReset } = productSlice.actions;
export default productSlice.reducer;
