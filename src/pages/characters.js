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
	const {data} = useSWR('/api/characters', fetcher, {
		refreshInterval: 5000,
	});

	const dispatch = useDispatch();

	const columns = [
		{
			field: 'CharID',
			headerName: 'ID',
		},
		{
			field: 'CharName16',
			headerName: 'Name',
			flex: 1,
			valueGetter: (params) => `${params.value || '-'}`,
		},
		{
			field: 'guild',
			headerName: 'Guild',
			flex: 1,
			valueGetter: (params) => `${params.value ? params.value.Name : '-'}`,
		},
		{
			field: 'CurLevel',
			headerName: 'Level',
			flex: 1,
		},
		{
			field: 'HwanLevel',
			headerName: 'HwanLevel',
			flex: 1,
		},
		{
			field: 'HP',
			headerName: 'HP',
			flex: 1,
		},
		{
			field: 'MP',
			headerName: 'MP',
			flex: 1,
		},
		{
			field: 'Strength',
			headerName: 'Strength',
			flex: 1,
		},
		{
			field: 'Intellect',
			headerName: 'Intellect',
			flex: 1,
		},
		{
			field: 'RemainGold',
			headerName: 'Gold',
			flex: 1,
		},
		{
			field: 'connection',
			headerName: 'Connected',
			flex: 1,
			renderCell: (params) => (
				<div style={{display: 'flex', alignItems: 'center'}}>
					<Badge badgeContent={''} color={params?.value ? 'success' : 'error'} />
				</div>
			),
		},
		{
			field: 'LastLogout',
			headerName: 'Last Logout',
			flex: 1,
			valueGetter: (params) =>
				`${params?.value ? dayjs(params.value).format('MM/DD/YYYY HH:mm:ss') : 'N/A'}`,
		},
	];

	useEffect(() => {
		dispatch(
			set({
				breadcrumbs: [
					{
						name: 'Characters',
						url: '/characters',
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
					getRowId={(row) => row.CharID}
					rows={data?.results || []}
					columns={columns}
					onRowClick={console.info}
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
