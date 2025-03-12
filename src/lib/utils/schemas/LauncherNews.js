export default {
	name: 'LauncherNews',
	type: 'array',
	items: {
		type: 'object',
		properties: {
			subject: {
				type: 'string',
			},
			article: {
				type: 'string',
			},
			year: {
				type: 'uint16',
			},
			month: {
				type: 'uint16',
			},
			day: {
				type: 'uint16',
			},
			hour: {
				type: 'uint16',
			},
			minute: {
				type: 'uint16',
			},
			second: {
				type: 'uint16',
			},
			ms: {
				type: 'uint32',
			},
		},
	},
};
