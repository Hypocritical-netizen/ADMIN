import axios from 'axios';

const {API_HOST} = process.env;

export default async function handler(req, res) {
	if (req.method === 'POST') {
		const {
			body: {connections, payload},
		} = req;

		await axios.post(`${API_HOST}/packet`, {
			connections,
			payload: {
				opcode: payload.opcode,
				data: payload.data,
				direction: payload.direction,
				encrypted: payload.encrypted ? 1 : 0,
				massive: payload.massive ? 1 : 0,
			},
		});

		return res.status(200).send({message: "OK"});
	}

	return res.status(404).end();
}
