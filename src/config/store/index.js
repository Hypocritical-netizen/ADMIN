import {configureStore} from '@reduxjs/toolkit';
import {persistReducer, persistStore} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';
import reducers from './reducers';

const persistConfig = {
	key: 'root',
	storage,
	whitelist: ['appState'],
};

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
	reducer: persistedReducer,
	devTools: process.env.NODE_ENV === 'development',
	middleware: [thunk],
});

export const persistor = persistStore(store);
