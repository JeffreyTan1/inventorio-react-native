import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  settings :
  {
    localAuthRequired: false,
  }
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    changeLocalAuthReducer: (state, action) => {
      let settings;
      switch (action.payload) {
        case 'on':
          settings = {...state, localAuthRequired: true};
          break;
        case 'off':
          settings = {...state, localAuthRequired: false};
          break;
        default:
          break;
      }
      state.settings = settings
    },
  },

})

export const { changeLocalAuthReducer } = settingsSlice.actions

export default settingsSlice.reducer