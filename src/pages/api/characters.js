import axios from 'axios';

const {API_HOST} = process.env;

export default async function handler(req, res) {
	const {data} = await axios.post(`${API_HOST}/crud/character/search`, {
		query: {
            guild: {},
            connection: {},
			$where: {
                CharID: {
                    $gt: 0,
                }
            }
		},
		fields: [],
	});



	return res.status(200).json(data);
}
