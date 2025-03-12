import axios from 'axios';

const {API_HOST} = process.env;

export default async function handler(req, res) {
	const {data} = await axios.post(`${API_HOST}/crud/objects/search`, {
		query: {},
		fields: ['ID', 'CodeName128', 'NameStrID128', 'TypeID1', 'TypeID2', 'TypeID3', 'TypeID4', 'Link'],
	});

	return res.status(200).json(data.results);
}
