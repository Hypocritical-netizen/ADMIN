class Compiler {
	constructor() {
		this.buffer = [];
	}

	uint8(value) {
		this.buffer.push(value & 0xff);
	}

	uint16(value) {
		this.buffer.push(value & 0xff);
		this.buffer.push((value >> 8) & 0xff);
	}

	uint32(value) {
		this.buffer.push(value & 0xff);
		this.buffer.push((value >> 8) & 0xff);
		this.buffer.push((value >> 16) & 0xff);
		this.buffer.push((value >>> 24) & 0xff); // Use unsigned right shift
	}

	uint64(value) {
		const low = Number(value & BigInt(0xffffffff));
		const high = Number(value >> BigInt(32));
		this.uint32(low);
		this.uint32(high);
	}

	string(value) {
		const len = value.length;
		this.uint16(len);
		for (let i = 0; i < len; i++) {
			this.uint8(value.charCodeAt(i));
		}
	}

	float(value) {
		const buffer = new ArrayBuffer(4);
		const view = new DataView(buffer);
		view.setFloat32(0, value, true);
		for (let i = 0; i < 4; i++) {
			this.buffer.push(view.getUint8(i));
		}
	}

	number(value) {
		this.uint32(value);
	}

	boolean(value) {
		this.uint8(value ? 1 : 0);
	}

	bytes(value) {
		for (const element of value) {
			this.buffer.push(element);
		}
	}

	buffer() {
		return new Uint8Array(this.buffer);
	}

	fromSchema(schema, data) {
		const {type, properties, items} = schema;
		const keys = properties ? Object.keys(properties) : [];

		switch (type) {
			case 'object':
				for (const key of keys) {
					this.fromSchema(properties[key], data[key]);
				}
				break;

			case 'array':
				for (const item of data) {
					this.fromSchema(items, item);
				}
				break;

			default:
				if (typeof this[type] === 'function') {
					this[type](data);
				}
				break;
		}
	}
}

export default Compiler;
