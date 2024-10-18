// store/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    userName : null,
    phone: null,
    address: null,
    pay: null,
    account: null,
    password: null,
    email: null,
    Verification_code: null,
    enable: null,
    balance: null,
    token : null
  },
  reducers: {
    global_userName: (state, action) => {
      state.userName = action.payload;
    },
    global_phone: (state, action) => {
      state.phone = action.payload;
    },
    global_address: (state, action) => {
        state.address = action.payload;
    },
    global_pay: (state, action) => {
        state.pay = action.payload;
    },
    global_account: (state, action) => {
        state.account = action.payload;
    },
    global_password: (state, action) => {
        state.password = action.payload;
    },
    global_Email: (state, action) => {
        state.email = action.payload;
    },
    global_Verification_code: (state, action) => {
        state.Verification_code = action.payload;
    },
    global_enable: (state, action) => {
        state.enable = action.payload;
    },
    global_balance: (state, action) => {
        state.balance = action.payload;
    },
    global_token: (state, action) => {
      state.token = action.payload;
  },
  },
});

export const { global_userName, global_phone, global_address, global_pay, global_account, global_password, 
  global_Email, global_Verification_code, global_enable, global_balance, global_amount, global_token} = userSlice.actions;
export default userSlice.reducer;
