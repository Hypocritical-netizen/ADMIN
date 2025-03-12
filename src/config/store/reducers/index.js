import {combineReducers} from 'redux';

import appState from './appState';
import appCache from './appCache';

export default combineReducers({
	appState,
	appCache,
});
