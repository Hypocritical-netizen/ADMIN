import Image from 'next/image';
import {Button, TextField, Box, Container, Snackbar, Alert as MuiAlert} from '@mui/material';
import {useForm, Controller} from 'react-hook-form';
import axios from 'lib/utils/axios';
import {useDispatch} from 'react-redux';
import {set} from 'config/store/reducers/appState';
import {forwardRef, useState} from 'react';
import FadeIn from './FadeIn';

const errorMessages = {
	minLength: 'Value is too short!',
	maxLength: 'Value is too long!',
	required: 'Value is required!',
};

const Alert = forwardRef(function Alert(props, ref) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function SignIn() {
	const dispatch = useDispatch();

	const {
		handleSubmit,
		control,
		formState: {errors},
	} = useForm({
		defaultValues: {
			username: '',
			password: '',
		},
	});

	const [error, showError] = useState(false);

	const handleCloseError = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}

		showError(false);
	};

	const onSubmit = async (payload) => {
		try {
			const {data} = await axios.post('/login', payload);

			dispatch(
				set({
					isAuthenticated: true,
					...data,
				})
			);
		} catch (error) {
			console.info({error});

			showError(true);
		}
	};

	return (
		<>
			<Container component="main" maxWidth="xs">
				<FadeIn>
					<Box
						sx={{
							marginTop: 10,
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
						}}
					>
						<Image src={`/logo.png`} priority width={120} height={120} alt={`SROSUITE`} />

						<Box
							variant="paper"
							component="form"
							onSubmit={handleSubmit(onSubmit)}
							noValidate
							sx={{mt: 1}}
						>
							<Controller
								name="username"
								control={control}
								rules={{
									required: true,
									minLength: 3,
									maxLength: 24,
								}}
								render={({field}) => (
									<TextField
										required
										type="text"
										label="Username"
										margin="normal"
										variant="standard"
										autoComplete="username"
										fullWidth
										helperText={
											errors.username?.type ? errorMessages[errors.username?.type] || 'Invalid value!' : false
										}
										error={errors.username ? true : false}
										{...field}
									/>
								)}
							/>

							<Controller
								name="password"
								control={control}
								rules={{
									required: true,
									minLength: 6,
									maxLength: 64,
								}}
								render={({field}) => (
									<TextField
										required
										type="password"
										label="Username"
										margin="normal"
										variant="standard"
										autoComplete="password"
										fullWidth
										helperText={
											errors.password?.type ? errorMessages[errors.password?.type] || 'Invalid value!' : false
										}
										error={errors.password ? true : false}
										{...field}
									/>
								)}
							/>

							<Button type="submit" fullWidth variant="contained" sx={{mt: 3, mb: 2}}>
								Login
							</Button>
						</Box>
					</Box>
				</FadeIn>
			</Container>

			<Snackbar open={error} autoHideDuration={3000} onClose={handleCloseError}>
				<Alert onClose={handleCloseError} severity="error" sx={{width: '100%'}}>
					Invalid credentials.
				</Alert>
			</Snackbar>
		</>
	);
}
