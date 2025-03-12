import Image from 'next/image';
import {CircularProgress} from '@mui/material';

const Loading = () => (
	<div className="loading">
		<Image
			className="background"
			src={`/logo.png`}
			priority
			width={120}
			height={120}
			alt={`SRO Suite`}
		/>
		<CircularProgress thickness={2} size={120} className="circularProgress" />
	</div>
);

export default Loading;
