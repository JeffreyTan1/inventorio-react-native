import {configureStore} from '@reduxjs/toolkit';
import settingsReducer from './settingsSlice';
import themeReducer from "./themeSlice"
import {combineReducers} from 'redux';

import {
  persistReducer,
  persistStore,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

const rootReducer = combineReducers({
  settings: settingsReducer,
  theme: themeReducer
});

const persistConfig = {
  key: 'root',
  version: 1,
  storage: AsyncStorage,
  whitelist: ['settings', 'theme']
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  }),

});

export const persistor = persistStore(store);
export default store;