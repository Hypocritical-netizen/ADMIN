import axios from 'axios';
import md5 from 'md5';
import jwt from 'jsonwebtoken';

const {API_HOST, JWT_KEY} = process.env;

export default async function handler(req, res) {
	if (req.method === 'POST') {
		const {
			body: {username, password},
		} = req;

		const {
			data: {
				results: [user],
				total,
			},
		} = await axios.post(`${API_HOST}/crud/user/search`, {
			query: {
				$where: {
					StrUserID: username,
					password: md5(password),
				},
			},
			fields: ['StrUserID', 'JID','sec_primary', 'sec_content'],
		});

		if (total === 1) {
			const {JID, StrUserID, sec_primary, sec_content} = user;

			if (sec_primary !== 1 || sec_content !== 1) throw new Error('ACCESS_DENIED');

			const token = jwt.sign({JID}, JWT_KEY, {expiresIn: '30d'});

			return res.status(200).send({
				StrUserID,
				JID,
				token,
			});
		}

		return res.status(401).send({
			error: 'INVALID_CREDENTIALS',
		});
	} else {
		return res.status(404).end();
	}
}
