export default {
	name: 'PositionRequest',
	type: 'object',
	properties: {
		status: {
			type: 'uint8',
		},
		RegionID: {
			type: 'uint8',
		},
		coordinates: {
			type: 'object',
			properties: {
				x: {
					type: 'uint16',
				},
				y: {
					type: 'uint16',
				},
				z: {
					type: 'uint16',
				},
			},
		},
	},
};
