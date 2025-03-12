import {Fade} from '@mui/material';
import {useEffect, useState} from 'react';

function FadeIn({children, delay}) {
	const [show, setShow] = useState(false);

	useEffect(() => {
		const timeout = setTimeout(() => {
			setShow(true);
		}, delay || 500);

		return () => {
			clearTimeout(timeout);
		};
	});

	return <Fade in={show}>{children}</Fade>;
}

export default FadeIn;
