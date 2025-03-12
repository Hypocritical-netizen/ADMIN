import {useEffect, useState, useRef} from 'react';
import {useDispatch} from 'react-redux';
import {set} from 'config/store/reducers/appState';
import useSWR from 'swr';
import axios from 'axios';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Decompiler from 'lib/utils/decompiler';
import schemas from 'lib/utils/schemas';
import dayjs from 'dayjs';
import {Container, TextField, Typography} from '@mui/material';
import Code from 'lib/components/shared/Code';
import {toast} from 'react-toastify';
import PacketSender from 'lib/components/shared/PacketSender';

const LIMIT_MESSAGES = 99;

const fetcher = (url) => axios.get(url).then((res) => res.data);

function Bot() {
	// const [objects, setObjects] = useState([]);
	const [connection, setConnection] = useState(0);
	const [messages, setMessages] = useState([]);
	const [direction, setDirection] = useState('both');
	const [opcode, setOpcode] = useState(0);
	const dispatch = useDispatch();
	const scrollContainerRef = useRef(null);

	const {data} = useSWR('/api/connections', fetcher, {
		refreshInterval: false,
	});

	const triggerMonitor = async (id, enabled = true) => {
		// const {data} = await axios.get('/api/objects');

		await axios.post('/api/monitor', {
			id,
			enabled,
		});

		// setObjects(data);
	};

	const onChangeConnection = (e) => {
		const id = e.target.value;
		setConnection(id);
	};

	const onStopMonitor = async () => {
		await triggerMonitor(connection, false);
		setConnection(0);
		setMessages([]);
	};

	const getFilteredMessages = () => {
		if (opcode > 0) {
			return messages.filter((msg) => msg.opcode === opcode);
		} else {
			return direction === 'both' ? messages : messages.filter((msg) => msg.direction === direction);
		}
	};

	const replayPacket = async (message) => {
		console.info({message});
		try {
			await axios.post('/api/packet', {
				connections: [connection],
				payload: message,
			});

			toast.success(`Packet sent successfully!`);
		} catch (error) {
			toast.error('Failed to send packet!');
		}
	};

	useEffect(() => {
		dispatch(
			set({
				breadcrumbs: [
					{
						name: 'Tools',
						url: '/tools',
					},
					{
						name: 'Packet Bot',
						url: '/tools/bot',
					},
				],
			})
		);

		const ws = new WebSocket('ws://localhost:8080');

		ws.onmessage = (event) => {
			const message = JSON.parse(event.data);

			const schema = schemas[message.opcode] || false;

			if (schema) {
				const read = new Decompiler(message.data);

				read.pointer = 0;

				const data = read.fromSchema(schema);

				// if (!Array.isArray(data)) {
				// 	const keys = Object.keys(data);

				// 	if (keys.includes("RefObjID")) {
						
				// 		data.RefObject = objects.find(obj => obj.ID === data.RefObjID) || null;
				// 	}
				// }

				setMessages((prevMessages) => [...prevMessages.slice(0, LIMIT_MESSAGES), {...message, data}]);

				return;
			}

			if (![8194].includes(message.opcode))
				setMessages((prevMessages) => [...prevMessages.slice(0, LIMIT_MESSAGES), message]);
		};

		return () => {
			ws.close();
		};
	}, []);

	useEffect(() => {
		if (scrollContainerRef.current) {
			scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
		}
	}, [messages]);

	useEffect(() => {
		if (connection) {
			triggerMonitor(connection);
		}
	}, [connection]);

	return data?.results?.length ? (
		<Box sx={{display: 'flex', flexDirection: 'column'}}>
			{data?.results?.length > 0 && (
				<Box sx={{my: 2, display: 'flex'}}>
					<Select
						value={connection}
						defaultValue={0}
						onChange={onChangeConnection}
						sx={{minWidth: '200px', textAlign: 'left'}}
					>
						<MenuItem value={0} disabled>
							Choose Connection
						</MenuItem>
						{data.results.map((connection, idx) => (
							<MenuItem value={connection.ref} key={idx}>
								{`${connection.ip} | `}
								{connection?.hwid ? `${connection.hwid} | ` : 'N/A | '}
								{connection?.user ? `${connection.user.StrUserID}` : ''}
								{connection?.character ? ` | ${connection.character.CharName16}` : ''}
							</MenuItem>
						))}
					</Select>

					{connection !== 0 && (
						<Box flexDirection={'row'} sx={{alignItems: 'center'}}>
							<Button variant="outlined" onClick={onStopMonitor} sx={{py: 2, ml: 2, mr: 2}}>
								Stop Monitor
							</Button>

							<Select
								onChange={(e) => setDirection(e.target.value)}
								value={direction}
								sx={{minWidth: '200px', textAlign: 'left', paddingTop: '1px', paddingBottom: '1px'}}
							>
								<MenuItem value={'both'}>Both directions</MenuItem>
								<MenuItem value={'user'}>User</MenuItem>
								<MenuItem value={'server'}>Server</MenuItem>
							</Select>

							<TextField
								sx={{ml: 2, mr: 1, paddingTop: '2px', paddingBottom: '2px'}}
								type="number"
								variant="outlined"
								placeholder="FILTER BY OPCODE"
								onChange={(e) => setOpcode(Number(e.target.value))}
							/>

							<PacketSender
								selected={
									connection === 0
										? []
										: data.results.length > 0
										? [data.results.find((i) => i.ref === connection)]
										: []
								}
								isLarge={true}
							/>
						</Box>
					)}
				</Box>
			)}
			{connection !== 0 && (
				<Box
					sx={{
						border: '1px solid #000',
						padding: '5px',
						height: 'calc(100vh - 180px)',
						width: '100%',
						overflowY: 'auto',
					}}
					ref={scrollContainerRef}
				>
					{getFilteredMessages().map((message, index) => (
						<Box
							sx={{mt: 1, backgroundColor: '#000', padding: '8px', borderRadius: '5px', width: '100%'}}
							key={index}
						>
							<Box flexDirection="row" display="flex" justifyContent="space-between">
								<Typography fontSize={12} color="primary">
									{dayjs(new Date()).format('DD/MM/YYYY HH:mm:ss.SSS')}
								</Typography>
								<Button variant="outlined" onClick={() => replayPacket(message)}>
									REPLAY
								</Button>
							</Box>
							<Box>
								<Typography fontSize={12}>
									<b sx={{color: 'primary'}}>Direction:</b> {message.direction}
								</Typography>
								<Typography fontSize={12}>
									<b>Opcode:</b> {message.opcode} (0x{message.opcode.toString(16).toUpperCase()})
								</Typography>
								<Typography fontSize={12}>
									<b>Encrypted:</b> {message.encrypted ? 'Yes' : 'No'}
								</Typography>
								<Typography fontSize={12}>
									<b>Massive:</b> {message.massive ? 'Yes' : 'No'}
								</Typography>
								<Box>
									<Code>{JSON.stringify(message.data, null, 1)}</Code>
								</Box>
							</Box>
						</Box>
					))}
				</Box>
			)}

			{connection === 0 && (
				<>
					<Typography variant="h4">Choose a connection to start monitoring</Typography>
					<Typography variant="body1">
						Log is limited to {LIMIT_MESSAGES + 1} most recent packets
					</Typography>
				</>
			)}
		</Box>
	) : (
		<>
			<Typography variant="h4">NO CONNECTIONS FOUND</Typography>
			<Typography variant="body1">Connections list gets updated every 5 seconds.</Typography>
		</>
	);
}

export default Bot;
