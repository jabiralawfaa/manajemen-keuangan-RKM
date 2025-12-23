import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  members: [],
  selectedMember: null,
  isLoading: false,
  error: null
}

const membersSlice = createSlice({
  name: 'members',
  initialState,
  reducers: {
    setMembers: (state, action) => {
      state.members = action.payload
    },
    setSelectedMember: (state, action) => {
      state.selectedMember = action.payload
    },
    addMember: (state, action) => {
      state.members.push(action.payload)
    },
    updateMember: (state, action) => {
      const index = state.members.findIndex(member => member._id === action.payload._id)
      if (index !== -1) {
        state.members[index] = action.payload
      }
    },
    deleteMember: (state, action) => {
      state.members = state.members.filter(member => member._id !== action.payload)
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
  setMembers, 
  setSelectedMember, 
  addMember, 
  updateMember, 
  deleteMember, 
  setLoading, 
  setError 
} = membersSlice.actions

export default membersSlice.reducer