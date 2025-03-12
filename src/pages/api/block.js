import axios from 'axios';

const {API_HOST} = process.env;

export default async function handler(req, res) {
	switch (req.method) {
		case 'GET':
			
			const {data} = await axios.post(`${API_HOST}/crud/blocklist/search`, {
				query: {
					
				},
				fields: [],
			});

			console.info({data});

			return res.status(200).send({message: "OK"});
		case 'POST':
			return res.status(200).send({message: "OK"});
		default:
			return res.status(404).end();
	}
}
