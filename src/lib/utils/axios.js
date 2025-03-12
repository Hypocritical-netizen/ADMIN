import axios from 'axios';
import {store} from 'config/store';

const instance = axios.create({
	baseURL: '/api',
	timeout: 1000,
});

instance.interceptors.request.use(
	async (config) => {
		const {appState} = store.getState();

		if (appState?.isAuthenticated && appState?.token) {
			config.headers.Authorization = `Bearer ${appState.token}`;
		}

		return config;
	},
	(error) => Promise.reject(error)
);

export default instance;
