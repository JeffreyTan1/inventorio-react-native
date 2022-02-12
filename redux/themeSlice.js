import { createSlice } from '@reduxjs/toolkit'


const CustomLightTheme = {
  colors: {
    primary: '#30c2b0',
    accent: '#30c2b0',
    highlight: '#2ca899'
  },
};

const CustomDarkTheme = {
  colors: {
    primary: '#30c2b0',
    accent: '#30c2b0',
    highlight: '#2ca899'
  },
};


const initialState = 
{
  theme:
  {
    type: 'light', value: CustomLightTheme
  }
}

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    changeThemeReducer: (state, action) => {
      let theme;
      switch (action.payload) {
        case 'light':
          theme = {type: 'light', value: CustomLightTheme};
          break;
        case 'dark':
          theme = {type: 'dark', value: CustomDarkTheme};
          break;
        default:
          break;
      }
      state.theme = theme
    },
  },

})

export const { changeThemeReducer } = themeSlice.actions

export default themeSlice.reducer