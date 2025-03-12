import * as React from 'react';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PeopleIcon from '@mui/icons-material/People';
import TimerIcon from '@mui/icons-material/Timer';
import SettingsIcon from '@mui/icons-material/Settings';
import Image from 'next/image';

import {
	AppBlocking,
	Block,
	BlockSharp,
	ChatBubble,
	Dashboard,
	Face,
	ImportExport,
	ManageAccounts,
	Monitor,
	NoAccounts,
	Payments,
	PeopleTwoTone,
	ShoppingCartCheckout,
} from '@mui/icons-material';
import {useRouter} from 'next/router';
import Link from 'next/link';

const categories = [
	{
		id: 'Database',
		children: [
			{
				id: 'Connections',
				icon: <ImportExport />,
				url: '/',
			},
			{
				id: 'HWID/IP Bans',
				icon: <AppBlocking />,
				url: '/blocklist',
			},
			{
				id: 'Account Bans',
				icon: <NoAccounts />,
				url: '/punishment',
			},
			{
				id: 'Accounts',
				icon: <ManageAccounts />,
				url: '/accounts',
			},
			{
				id: 'Characters',
				icon: <Face />,
				url: '/characters',
			},
		],
	},
	{
		id: 'Tools',
		children: [
			{
				id: 'Game Notifications',
				icon: <ChatBubble />,
				url: '/tools/notice',
			},
			{
				id: 'Packet Monitor',
				icon: <Monitor />,
				url: '/tools/monitor',
			},
		],
	},
];

const item = {
	color: 'rgba(255, 255, 255, 0.7)',
	'&:hover, &:focus': {
		bgcolor: 'rgba(255, 255, 255, 0.08)',
	},
};

function Navigation(props) {
	const {...other} = props;
	const router = useRouter();

	return (
		<Drawer variant="permanent" {...other}>
			<List disablePadding>
				{categories.map(({id, children}) => (
					<Box key={id}>
						<ListItem sx={{pt: 2}}>
							<ListItemText sx={{color: '#ccc'}}>
								<b style={{fontSize: '0.8em'}}>{id}</b>
							</ListItemText>
						</ListItem>
						{children.map(({id: childId, icon, url}, idx) => (
							<ListItem key={childId} disablePadding>
								<ListItemButton
									sx={{...item, display: 'flex'}}
									LinkComponent={Link}
									href={url}
									selected={router.asPath == url}
								>
									<ListItemText sx={{color: '#fff', py: 0}}>{childId}</ListItemText>
									<ListItemIcon sx={{color: '#fff', py: 0, minWidth: 'auto'}}>{icon}</ListItemIcon>
								</ListItemButton>
							</ListItem>
						))}

						<Divider sx={{mt: 0}} />
					</Box>
				))}
			</List>
		</Drawer>
	);
}

export default Navigation;
