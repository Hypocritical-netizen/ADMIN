import 'styles/globals.css';
import 'prismjs/themes/prism-tomorrow.css';
import 'react-toastify/dist/ReactToastify.css';
import theme from 'config/theme';
import Head from 'next/head';
import Loading from 'lib/components/Loading';
import Navigation from 'lib/components/Navigation';
import Header from 'lib/components/Header';
import {useState} from 'react';
import {Fragment} from 'react';
import {ThemeProvider} from '@mui/material/styles';
import {Provider} from 'react-redux';
import {store, persistor} from 'config/store';
import {useMediaQuery, CssBaseline, Box} from '@mui/material';
import {PersistGate} from 'redux-persist/integration/react';
import {ConfirmProvider} from 'material-ui-confirm';
import withAuthentication from 'lib/withAuth';
import { ToastContainer } from 'react-toastify';

const drawerWidth = 256;

function AppBase(props) {
	const {Component, pageProps} = props;

	const [mobileOpen, setMobileOpen] = useState(false);
	const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};

	const PageComponent = withAuthentication(() => (
		<ConfirmProvider>
			<ToastContainer />
			<Box sx={{display: 'flex', minHeight: '100vh'}}>
				<Box component="nav" sx={{width: {sm: drawerWidth}, flexShrink: {sm: 0}}}>
					{isSmUp ? null : (
						<Navigation
							PaperProps={{style: {width: drawerWidth}}}
							variant="temporary"
							open={mobileOpen}
							sx={{backgroundColor: 'black'}}
							onClose={handleDrawerToggle}
						/>
					)}

					<Navigation
						PaperProps={{style: {width: drawerWidth, backgroundColor: 'black'}}}
						sx={{display: {sm: 'block', xs: 'none'}}}
					/>
				</Box>
				<Box sx={{flex: 1, display: 'flex', flexDirection: 'column'}}>
					<Header onDrawerToggle={handleDrawerToggle} />
					<Box padding={3} paddingTop={0}>
						<Component {...pageProps} />
					</Box>
				</Box>
			</Box>
		</ConfirmProvider>
	));

	return (
		<Fragment>
			<Head>
				<base href="/" />
				<meta charSet="utf-8" />
				<meta name="viewport" content="initial-scale=1, width=device-width" />
				<meta name="description" content="Administration interface" />
				<title>Administration</title>
				<link rel="icon" href="/icon.png" />
			</Head>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<Provider store={store}>
					<PersistGate loading={<Loading />} persistor={persistor}>
						<PageComponent />
						<div id="popover-root" />
					</PersistGate>
				</Provider>
			</ThemeProvider>
		</Fragment>
	);
}

export default AppBase;
