import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  payments: [],
  selectedPayment: null,
  isLoading: false,
  error: null
}

const paymentsSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    setPayments: (state, action) => {
      state.payments = action.payload
    },
    setSelectedPayment: (state, action) => {
      state.selectedPayment = action.payload
    },
    addPayment: (state, action) => {
      state.payments.push(action.payload)
    },
    updatePayment: (state, action) => {
      const index = state.payments.findIndex(payment => payment._id === action.payload._id)
      if (index !== -1) {
        state.payments[index] = action.payload
      }
    },
    deletePayment: (state, action) => {
      state.payments = state.payments.filter(payment => payment._id !== action.payload)
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    }
  }
})

export const { 
  setPayments, 
  setSelectedPayment, 
  addPayment, 
  updatePayment, 
  deletePayment, 
  setLoading, 
  setError 
} = paymentsSlice.actions

export default paymentsSlice.reducer