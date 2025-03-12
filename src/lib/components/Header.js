import AppBar from '@mui/material/AppBar';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import {LogoutOutlined} from '@mui/icons-material';
import {useDispatch, useSelector} from 'react-redux';
import {set, initialState} from 'config/store/reducers/appState';
import {useConfirm} from 'material-ui-confirm';
import {Breadcrumbs, Typography} from '@mui/material';
import {makeStyles} from '@mui/styles';
import Link from 'next/link';

const useStyles = makeStyles((theme) => ({
	link: {	
		textDecoration: 'none', // Set the text decoration to none to remove underline
		'&:hover': {
			textDecoration: 'none', // Remove underline on hover as well
		},
	},
}));

function Header(props) {
	const classes = useStyles();
	const {onDrawerToggle} = props;
	const dispatch = useDispatch();
	const {breadcrumbs} = useSelector((state) => state.appState);

	const confirm = useConfirm();

	const onClickLogout = () => {
		confirm({
			description: `Are you sure to logout?`,
		}).then(() => {
			dispatch(set(initialState));
		});
	};

	return (
		<AppBar color="primary" position="sticky" elevation={0}>
			<Toolbar>
				<Grid container spacing={1} alignItems="center">
					<Grid sx={{display: {sm: 'none', xs: 'block'}}} item>
						<IconButton color="inherit" aria-label="open drawer" onClick={onDrawerToggle} edge="start">
							<MenuIcon />
						</IconButton>
					</Grid>
					<Grid item xs>
						<Breadcrumbs aria-label="breadcrumb">
							{breadcrumbs?.map((i, idx) =>
								idx === breadcrumbs.length - 1 ? (
									<Typography key={i.url} color="text.primary">
										{i.name}
									</Typography>
								) : (
									<Link key={i.url} className={classes.link} component="span" color="inherit" href={i.url}>
										<Typography color="text.primary">{i.name}</Typography>
									</Link>
								)
							)}
						</Breadcrumbs>
					</Grid>
					<Grid item>
						<IconButton onClick={onClickLogout} color="inherit" sx={{p: 0.5}}>
							<LogoutOutlined />
						</IconButton>
					</Grid>
				</Grid>
			</Toolbar>
		</AppBar>
	);
}

export default Header;
