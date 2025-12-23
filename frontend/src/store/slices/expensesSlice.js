import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  expenses: [],
  selectedExpense: null,
  isLoading: false,
  error: null
}

const expensesSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    setExpenses: (state, action) => {
      state.expenses = action.payload
    },
    setSelectedExpense: (state, action) => {
      state.selectedExpense = action.payload
    },
    addExpense: (state, action) => {
      state.expenses.push(action.payload)
    },
    updateExpense: (state, action) => {
      const index = state.expenses.findIndex(expense => expense._id === action.payload._id)
      if (index !== -1) {
        state.expenses[index] = action.payload
      }
    },
    deleteExpense: (state, action) => {
      state.expenses = state.expenses.filter(expense => expense._id !== action.payload)
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
  setExpenses, 
  setSelectedExpense, 
  addExpense, 
  updateExpense, 
  deleteExpense, 
  setLoading, 
  setError 
} = expensesSlice.actions

export default expensesSlice.reducer