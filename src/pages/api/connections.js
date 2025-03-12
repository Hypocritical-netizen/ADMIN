import axios from 'axios';

const {API_HOST} = process.env;

export default async function handler(req, res) {
	const {data} = await axios.post(`${API_HOST}/crud/connection/search`, {
		query: {
			user: {
				wallet: {},
			},
			character: {},
		},
		order: 'created desc',
		fields: [
			'character.CharName16',
			'user.StrUserID',
			'user.sec_primary',
			'user.sec_content',
			'user.wallet.silk_own',
			'user.wallet.silk_point',
			'user.wallet.silk_gift',
		],
	});

	return res.status(200).json(data);
}
