import { createSlice } from '@reduxjs/toolkit'


const CustomLightTheme = {
  colors: {
    primary: '#fcca47',
    underlayDark: '#d4a939',
    underlayLight: '#DDDDDD',
    text: '#000',
    background: '#fff',
    grey: '#c4c4c4'
  },
};

const CustomDarkTheme = {
  colors: {
    primary: '#fcca47',
    underlayDark: '#d4a939',
    underlayLight: '#3d3d3d',
    text: '#fff',
    background: '#000',
    grey: '#c4c4c4'
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
    // changePrimaryColorReducer: (state, action) => {
    //   state.theme.value.primary = action.payload
    // },
  },

})

export const { changeThemeReducer } = themeSlice.actions

export default themeSlice.reducer