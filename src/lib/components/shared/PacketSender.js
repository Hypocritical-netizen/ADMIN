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
import {useDispatch} from 'react-redux';

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

const PacketSender = ({selected = [], isLarge = false}) => {
	const [state, setState] = useState({
		filtered: selected || [],
		packetModalOpen: false,
		payload: {
			opcode: 0x0000,
			data: [],
			encrypted: false,
			massive: false,
			direction: 'server',
		},
		loading: false,
		confirmed: false,
	});

	const onClickSendPacket = () => {
		setState({
			...state,
			packetModalOpen: true,
		});
	};

	const onClickConfirmSendPacket = async () => {
		setState({
			...state,
			loading: true,
		});

		try {
			const connections = state.filtered.map((i) => i.ref);

			await axios.post('/api/packet', {
				connections,
				payload: state.payload,
			});

			toast.success(`Packet was sent successfully!`);
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

	return (
		<>
			<Button
				disabled={state.loading}
				sx={{
					marginLeft: '5px',
					...(isLarge ? {py: 2, mt: 0, pb: '14px'} : {}),
				}}
				variant="outlined"
				color="warning"
				onClick={onClickSendPacket}
			>
				SEND PACKET
			</Button>
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
									value={state.payload.direction}
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
									<FormControlLabel value="server" control={<Radio />} label="Send to Server" />
									<FormControlLabel value="client" control={<Radio />} label="Send to Client" />
								</RadioGroup>
							</FormControl>
						</Grid>

						<Grid item sx={{mt: 1}} xs={6}>
							<FormGroup>
								<FormControlLabel
									control={
										<Switch
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
		</>
	);
};

export default PacketSender;
