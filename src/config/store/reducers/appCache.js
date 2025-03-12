import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {merge} from 'lodash';

const query = createAsyncThunk(
	'api_query',
	async ({
		payload = {
			method: 'POST',
			url: '',
		},
	}) => {
		const {data} = await axios(payload);
		return {...data, lastFetchTime: new Date()};
	}
);

const initialState = {
	initTime: new Date(),
	cacheLoading: false,
	errors: {},
};

const {
	actions: {set},
	reducer,
} = createSlice({
	name: 'appCache',
	initialState,
	reducers: {
		set: (state, {payload}) => {
			state = merge(state, payload);
		},
	},
	extraReducers: {
		[query.pending]: (state) => {
			state.cacheLoading = true;
		},
		[query.fulfilled]: (state, {meta, payload}) => {
			state.cacheLoading = false;
			state[meta.arg.model] = payload;
		},
		[query.rejected]: (state, {error, meta}) => {
			state.cacheLoading = false;
			state.errors = {
				...state.errors,
				[meta.arg.model]: error,
			};
		},
	},
});

export {set, query};
export default reducer;
