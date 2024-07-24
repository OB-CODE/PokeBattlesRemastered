import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface loggedInState {
  value: boolean
}

const initialState: loggedInState = {
  value: false,
}

export const loggedSlice = createSlice({
  name: 'changeLoggedState',
  initialState,
  reducers: {
    changeLoggedStatus: (state) => {
      state.value = !state.value;
    },
  },
})

export const { changeLoggedStatus } = loggedSlice.actions

export default loggedSlice.reducer

