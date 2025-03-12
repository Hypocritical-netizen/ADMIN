import axios from 'axios';

const {API_HOST} = process.env;

export default async function handler(req, res) {
	const {data} = await axios.post(`${API_HOST}/crud/user/search`, {
		query: {
			wallet: {},
			characterLink: {},
			connection: {},
		},
		fields: [],
	});

	return res.status(200).json(data);
}
