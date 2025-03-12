import {createSlice} from '@reduxjs/toolkit';
import {merge} from 'lodash';

export const initialState = {
	initTime: new Date(),
	isAuthenticated: false,
	token: false,
	StrUserID: false,
	JID: false,
	breadcrumbs: [
		{
			name: 'Dashboard',
			url: '/',
		},
	],
};

const {
	actions: {set},
	reducer,
} = createSlice({
	name: 'appState',
	initialState,
	reducers: {
		set: (state, {payload}) => {
			state = merge(state, payload);
			state.breadcrumbs = payload?.breadcrumbs || state.breadcrumbs;
		},
	},
});

export {set};
export default reducer;
