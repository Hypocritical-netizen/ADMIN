import {useState, useEffect} from 'react';
import useSWR from 'swr';
import axios from 'axios';
import {set} from 'config/store/reducers/appState';
import {Badge, Box, colors, Container, Grid} from '@mui/material';
import {DataGrid, GridToolbar} from '@mui/x-data-grid';
import {useDispatch} from 'react-redux';
import dayjs from 'dayjs';

const fetcher = (url) => axios.get(url).then((res) => res.data);

function Accounts() {
	const {data} = useSWR('/api/accounts', fetcher, {
		refreshInterval: 5000,
	});

	const dispatch = useDispatch();

	const columns = [
		{
			field: 'StrUserID',
			headerName: 'Username',
			flex: 1,
			valueGetter: (params) => `${params.value || '-'}`,
		},
		{
			field: 'Email',
			headerName: 'Mail',
			flex: 1,
			valueGetter: (params) => `${params.value || '-'}`,
		},
		{
			field: 'wallet',
			headerName: 'Silk',
			flex: 1,
			valueGetter: (params) => `${params.value?.silk_own || '-'}`,
		},
		{
			field: 'Sec_Primary',
			headerName: 'Rights(p)',
			flex: 1,
		},
		{
			field: 'Sec_Content',
			headerName: 'Rights(c)',
			flex: 1,
		},
		{
			field: 'connection',
			headerName: 'Connected',
			flex: 1,
			flexGrow: 'gro',
			renderCell: (params) => (
				<div style={{display: 'flex', alignItems: 'center'}}>
					<Badge badgeContent={''} color={params?.value ? 'success' : 'error'} />
				</div>
			),
		},
		{
			field: 'characterLink',
			headerName: 'Characters',
			flex: 1,
			valueGetter: (params) => `${params.value.length}`,
		},
		{
			field: 'Regtime',
			headerName: 'Created',
			flex: 1,
			valueGetter: (params) =>
				`${params?.value ? dayjs(params.value).format('MM/DD/YYYY HH:mm:ss') : 'N/A'}`,
			defaultValue: '-',
		},
	];

	useEffect(() => {
		dispatch(
			set({
				breadcrumbs: [
					{
						name: 'Accounts',
						url: '/accounts',
					},
				],
			})
		);
	}, []);

	return (
		<div style={{display: 'flex', height: '100%'}}>
			<div style={{flexGrow: 1}}>
				<DataGrid
					autoHeight
					getRowId={(row) => row.JID}
					rows={data?.results || []}
					columns={columns}
					checkboxSelection
					components={{
						Toolbar: () => (
							<Grid container>
								<Grid item xs={12}>
									<GridToolbar />
								</Grid>
							</Grid>
						),
					}}
				/>
			</div>
		</div>
	);
}

export default Accounts;
