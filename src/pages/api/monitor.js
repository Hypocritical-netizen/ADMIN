import axios from 'axios';

const {API_HOST} = process.env;

export default async function handler(req, res) {
	if (req.method === 'POST') {
		const {
			body: {
				id,
				enabled,
			},
		} = req;

		await axios.post(`${API_HOST}/monitor`, {
			id,
            enabled,
		});

		return res.status(200).send({message: "OK"});
	}

	return res.status(404).end();
}
