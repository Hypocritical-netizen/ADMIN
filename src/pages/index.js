import {useState, useEffect} from 'react';

import {set} from 'config/store/reducers/appState';
import {
	Box,
	Grid,
	Button,
	Modal,
	FormControl,
	InputLabel,
	FormControlLabel,
	Radio,
	RadioGroup,
	FormGroup,
	TextField,
	Chip,
	CircularProgress,
	Switch,
	Select,
	MenuItem,
} from '@mui/material';
import {DataGrid, GridToolbar} from '@mui/x-data-grid';
import useSWR from 'swr';
import axios from 'axios';
import {toast} from 'react-toastify';
import {useConfirm} from 'material-ui-confirm';
import {useDispatch} from 'react-redux';
import dayjs from 'dayjs';
// import ColorPickerDropdown from 'lib/components/shared/ColorPickerDropdown';

const fetcher = (url) => axios.get(url).then((res) => res.data);

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 640,
	bgcolor: 'background.paper',
	boxShadow: 24,
	p: 4,
};

function Connections() {
	const {data} = useSWR('/api/connections', fetcher, {
		refreshInterval: 5000,
	});

	const dispatch = useDispatch();

	const confirm = useConfirm();

	const [state, setState] = useState({
		selected: [],
		filtered: [],
		packetModalOpen: false,
		messageModalOpen: false,
		payload: {},
		loading: false,
	});

	const columns = [
		{
			field: 'ref',
			headerName: 'ID',
			flex: 2,
		},
		{
			field: 'module',
			headerName: 'context',
			flex: 1,
			defaultValue: '-',
		},
		{
			field: 'ip',
			headerName: 'IP',
			flex: 1,
			valueGetter: (params) => `${params.value || '-'}`,
		},
		{
			field: 'hwid',
			headerName: 'HWID',
			flex: 2,
			valueGetter: (params) => `${params.value || '-'}`,
		},
		{
			field: 'StrUserID',
			headerName: 'Username',
			flex: 1,
			valueGetter: (params) => `${params.value || '-'}`,
		},
		{
			field: 'CharName16',
			headerName: 'Charname',
			flex: 1,
			defaultValue: '-',
		},
		{
			field: 'silk_own',
			headerName: 'Silk',

			defaultValue: '-',
		},
		{
			field: 'sec_primary',
			headerName: 'Rights(p)',

			defaultValue: '-',
		},
		{
			field: 'sec_content',
			headerName: 'Rights(c)',

			defaultValue: '-',
		},
		{
			field: 'created',
			headerName: 'Connected Since',
			flex: 1,
			valueGetter: (params) =>
				`${params?.value ? dayjs(params.value.created).format('MM/DD/YYYY HH:mm:ss') : '-'}`,
			defaultValue: '-',
		},
		{
			field: 'updated',
			headerName: 'Last Update',
			flex: 1,
			valueGetter: (params) =>
				`${params?.value ? dayjs(params.value.updated).format('MM/DD/YYYY HH:mm:ss') : '-'}`,
		},
	];

	const rows = () =>
		data?.results?.map((i) => ({
			...i,
			...i.character,
			...i.user,
			...i.user?.wallet,
		})) || [];

	const onSelectionModelChange = (selectionModel) => {
		setState({
			...state,
			selected: selectionModel,
		});
	};

	const getFilteredConnections = () => {
		const loadedConnections = rows() || [];
		const selectedConnections = state.selected;

		return loadedConnections.filter((row) => selectedConnections.includes(row.id));
	};

	const onClickSendPacket = () => {
		const filtered = getFilteredConnections();
		setState({
			...state,
			filtered,
			payload: {
				opcode: 0x0000,
				data: [],
				encrypted: false,
				massive: false,
				direction: 'client',
			},
			packetModalOpen: true,
		});
	};

	const onClickSendMessage = () => {
		const filtered = getFilteredConnections();
		setState({
			...state,
			filtered,
			payload: {
				type: 1,
				message: '',
				// color: '#000000',
			},
			messageModalOpen: true,
		});
	};

	const onClickConfirmSendPacket = async () => {
		setState({
			...state,
			loading: true,
		});

		try {
			const filtered = getFilteredConnections();
			const connections = filtered.map((i) => i.ref);

			if (state?.confirmed) {
				await axios.post('/api/packet', {
					connections,
					payload: state.payload,
				});

				toast.success(`Packet was sent successfully!`);
			} else {
				confirm({
					content: (
						<>
							<b>This will send following packet to {filtered.length} connections.</b>
							<p style={{color: 'orange'}}>
								Be aware that sending to different modules at same time will cause the clients to crash.
							</p>
						</>
					),
				}).then(async () => {
					await axios.post('/api/packet', {
						connections,
						payload: state.payload,
					});

					toast.success(`Packet was sent successfully!`);
				});
			}
		} catch (e) {
			toast.error('Failed to send packet!');
		} finally {
			setState({
				...state,
				loading: false,
				confirmed: true,
			});
		}
	};

	const onClickConfirmSendMessage = async () => {
		setState({
			...state,
			loading: true,
		});

		try {
			const filtered = getFilteredConnections();
			const connections = filtered.map((i) => i.ref);
			console.info(state.payload);
			await axios.post('/api/message', {
				connections,
				payload: state.payload,
			});

			toast.success(`Message was sent successfully!`);
		} catch (e) {
			toast.error('Failed to send message!');
		} finally {
			setState({
				...state,
				loading: false,
			});
		}
	};

	const onClickDisconnect = async () => {
		setState({
			...state,
			loading: true,
		});
		try {
			const filtered = getFilteredConnections();
			const connections = filtered.map((i) => i.ref);

			confirm({
				description: `This will disconnect ${filtered.length} account(s) from the game.`,
			}).then(async () => {
				await axios.post('/api/disconnect', {connections});
				toast.success('Disconnected successfully!');
			});
		} catch (e) {
			toast.error('Failed to disconnect!');
		} finally {
			setState({
				...state,
				loading: false,
			});
		}
	};

	useEffect(() => {
		dispatch(
			set({
				breadcrumbs: [
					{
						name: 'Connections',
						url: '/connections',
					},
				],
			})
		);
	}, []);

	return (
		<>
			<div style={{display: 'flex', height: '100%'}}>
				<div style={{flexGrow: 1}}>
					<DataGrid
						autoHeight
						components={{
							Toolbar: () => (
								<Grid container>
									<Grid item xs={6}>
										<GridToolbar />
									</Grid>
									<Grid xs={6} item>
										<Grid
											sx={{
												marginTop: '5px',
												marginBottom: '-5px',
												paddingRight: '5px',
											}}
											container
											justifyContent="flex-end"
											alignItems="center"
										>
											{state.selected.length > 0 && (
												<>
													{state.selected.length} connection(s) selected...
													<Button
														sx={{
															marginLeft: '5px',
														}}
														variant="outlined"
														color="error"
														onClick={onClickDisconnect}
													>
														DISCONNECT
													</Button>
													<Button
														disabled={state.loading}
														sx={{
															marginLeft: '5px',
														}}
														variant="outlined"
														color="warning"
														onClick={onClickSendPacket}
													>
														PACKET
													</Button>
													<Button
														disabled={state.loading}
														sx={{
															marginLeft: '5px',
														}}
														variant="outlined"
														color="success"
														onClick={onClickSendMessage}
													>
														MESSAGE
													</Button>
												</>
											)}
										</Grid>
									</Grid>
								</Grid>
							),
						}}
						rows={rows()}
						columns={columns}
						checkboxSelection
						disableSelectionOnClick
						onSelectionModelChange={onSelectionModelChange}
					/>
				</div>
			</div>

			<Modal
				open={state.packetModalOpen}
				onClose={() => setState({...state, packetModalOpen: false})}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={style}>
					<Grid container>
						<Grid item xs={12}>
							<InputLabel sx={{pb: 2}}>Selected Connections:</InputLabel>

							{state.filtered.map((i, key) => (
								<Chip
									sx={{
										marginBottom: '5px',
										marginRight: '5px',
									}}
									key={key}
									label={`${i.module}: ${i?.CharName16 || i.ref}`}
								/>
							))}
						</Grid>

						<Grid item sx={{mt: 1}} xs={5}>
							<InputLabel htmlFor="opcode">OPCODE</InputLabel>
							<TextField
								sx={{width: '100%'}}
								type="number"
								variant="outlined"
								placeholder="28705"
								defaultValue={state.payload.opcode}
								onChange={({target: {value}}) =>
									setState({
										...state,
										payload: {
											...state.payload,
											opcode: parseInt(value),
										},
									})
								}
							/>
						</Grid>

						<Grid sx={{width: '100%', pl: 1}} item xs={7}>
							<FormControl component="fieldset">
								<RadioGroup
									sx={{paddingTop: '38px', pl: 2}}
									row
									aria-label="direction"
									id="direction"
									defaultValue={state.payload.direction}
									name="direction"
									onChange={({target: {value}}) =>
										setState({
											...state,
											payload: {
												...state.payload,
												direction: value,
											},
										})
									}
								>
									<FormControlLabel value="remote" control={<Radio />} label="Send to Server" />
									<FormControlLabel value="client" control={<Radio />} label="Send to Client" />
								</RadioGroup>
							</FormControl>
						</Grid>

						<Grid item sx={{mt: 1}} xs={6}>
							<FormGroup>
								<FormControlLabel
									control={
										<Switch
											defaultChecked={state.payload.encrypted}
											defaultValue={state.payload.encrypted}
											onChange={({target: {checked}}) =>
												setState({
													...state,
													payload: {
														...state.payload,
														encrypted: checked,
													},
												})
											}
										/>
									}
									label="Mark packet as Encrypted"
								/>
							</FormGroup>
						</Grid>
						<Grid item sx={{mt: 1}} xs={6}>
							<FormGroup>
								<FormControlLabel
									control={
										<Switch
											defaultChecked={state.payload.massive}
											defaultValue={state.payload.massive}
											onChange={({target: {checked}}) =>
												setState({
													...state,
													payload: {
														...state.payload,
														massive: checked,
													},
												})
											}
										/>
									}
									label="Mark packet as Massive"
								/>
							</FormGroup>
						</Grid>

						<Grid item sx={{mt: 1}} xs={12}>
							<InputLabel htmlFor="opcode">DATA</InputLabel>
							<TextField
								sx={{width: '100%', mb: 2}}
								type="textarea"
								aria-describedby="opcode-helper-text"
								variant="outlined"
								placeholder={`1,166,98,221,3,252,255,44,0`}
								onChange={({target: {value}}) =>
									setState({
										...state,
										payload: {
											...state.payload,
											buffer: value.split(',').map((i) => parseInt(i)),
										},
									})
								}
							/>
						</Grid>
					</Grid>

					<Button
						disabled={state.loading}
						onClick={onClickConfirmSendPacket}
						sx={{width: '100%', mt: 1}}
						variant="contained"
					>
						{state.loading ? <CircularProgress /> : 'SEND'}
					</Button>
				</Box>
			</Modal>

			<Modal
				open={state.messageModalOpen}
				onClose={() => setState({...state, messageModalOpen: false})}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={style}>
					<Grid container>
						<Grid item xs={12}>
							<InputLabel sx={{pb: 2}}>Selected Connections:</InputLabel>

							{state.filtered.map((i, key) => (
								<Chip
									sx={{
										marginBottom: '5px',
										marginRight: '5px',
									}}
									key={key}
									label={`${i.module}: ${i?.CharName16 || i.ref}`}
								/>
							))}
						</Grid>

						<Grid item sx={{mt: 1}} xs={2}>
							<InputLabel htmlFor="opcode">Type</InputLabel>
							<Select
								label="Number"
								value={state.payload.type}
								onChange={({target: {value}}) =>
									setState({
										...state,
										payload: {
											...state.payload,
											type: value,
										},
									})
								}
								style={{minWidth: 100}}
							>
								{[1, 2, 3, 4, 5, 6, 7].map((number) => (
									<MenuItem key={number} value={number}>
										{number}
									</MenuItem>
								))}
							</Select>
						</Grid>

						<Grid item sx={{mt: 1}} xs={10}>
							<InputLabel htmlFor="opcode">Message</InputLabel>
							<TextField
								sx={{width: '100%', mb: 2}}
								type="textarea"
								aria-describedby="opcode-helper-text"
								variant="outlined"
								placeholder={`Write something here...`}
								onChange={({target: {value}}) =>
									setState({
										...state,
										payload: {
											...state.payload,
											message: value,
										},
									})
								}
							/>
						</Grid>
						{/* <Grid item sx={{mt: 1}} xs={2}>
							<InputLabel htmlFor="opcode">Color</InputLabel>
							<ColorPickerDropdown
								onChange={({hex}) =>
									setState({
										...state,
										payload: {...state.payload, color: parseInt(hex.substring(1), 16)},
									})
								}
								disabled={state.payload.type < 6}
							/>
						</Grid> */}
					</Grid>

					<Button
						disabled={state.loading}
						onClick={onClickConfirmSendMessage}
						sx={{width: '100%', mt: 1}}
						variant="contained"
					>
						{state.loading ? <CircularProgress /> : 'SEND'}
					</Button>
				</Box>
			</Modal>
		</>
	);
}

export default Connections;
