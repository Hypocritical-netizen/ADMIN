import axios from 'axios';

const {API_HOST} = process.env;

export default async function handler(req, res) {
	if (req.method === 'POST') {
		const {
			body: {
				connections,
				payload: {message, type},
			},
		} = req;

		await axios.post(`${API_HOST}/message`, {
			connections,
			message,
			type,
		});

		return res.status(200).send({status: "OK"});
	}

	return res.status(404).end();
}
