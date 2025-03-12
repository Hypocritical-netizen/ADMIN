import useSWR from 'swr';
import axios from 'axios';

const fetcher = (url) => axios.get(url).then((res) => res.data);

function Blocklist() {
    const {data} = useSWR('/api/block', fetcher, {
		refreshInterval: 5000,
	});

    return (
        <>
            {JSON.stringify(data || {})};
        </>
    )
}

export default Blocklist;