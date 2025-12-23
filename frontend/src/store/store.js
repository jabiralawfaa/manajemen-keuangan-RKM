import { configureStore } from '@reduxjs/toolkit'
import authSlice from './slices/authSlice'
import membersSlice from './slices/membersSlice'
import paymentsSlice from './slices/paymentsSlice'
import expensesSlice from './slices/expensesSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice,
    members: membersSlice,
    payments: paymentsSlice,
    expenses: expensesSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST']
      }
    })
})