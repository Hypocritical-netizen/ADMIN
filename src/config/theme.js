import {createTheme, responsiveFontSizes} from '@mui/material/styles';
import {red} from '@mui/material/colors';

const theme = responsiveFontSizes(
	createTheme({
		palette: {
			mode: 'dark',
			primary: {
				main: '#701b6d',
			},
		},
		
	})
);

export default theme;
