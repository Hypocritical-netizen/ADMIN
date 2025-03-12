import get from 'lodash/get';
import {SIZE_TABLE} from './constants';

class Decompiler {
	constructor(data) {
		this.pointer = 0;
		if (data) this.init(data);
	}

	init(data) {
		this.view = new Uint8Array(data);
		return this;
	}

	uint8() {
		const value = this.view[this.pointer];
		this.pointer += SIZE_TABLE.uint8;
		return value;
	}

	uint16() {
		const value = (this.view[this.pointer + 1] << 8) | this.view[this.pointer];
		this.pointer += SIZE_TABLE.uint16;
		return value;
	}

	uint32() {
		return (
			this.view[this.pointer] +
			(this.view[this.pointer + 1] << 8) +
			(this.view[this.pointer + 2] << 16) +
			this.view[this.pointer + 3] * 2 ** 24
		);
	}

	uint64() {
		const low = this.uint32();
		const high = this.uint32();
		return BigInt(low) + (BigInt(high) << BigInt(32));
	}

	string(length = false) {
		const len = length || this.uint16();
		let str = '';

		for (let i = 0; i < len; i++) {
			const char = this.uint8();
			str += String.fromCharCode(char);
		}

		return str;
	}

	float() {
		const buffer = new ArrayBuffer(4);
		const view = new DataView(buffer);
		for (let i = 0; i < 4; i++) {
			view.setUint8(i, this.view[this.pointer + i]);
		}
		const value = view.getFloat32(0, true);
		this.pointer += SIZE_TABLE.float;
		return value;
	}

	number() {
		return this.uint32();
	}

	boolean() {
		return this.uint8() === 1;
	}

	bytes(length = 0) {
		const value = this.view.subarray(this.pointer, this.pointer + length);
		this.pointer += length;
		return new Uint8Array(value);
	}

	buffer() {
		return this.bytes(this.view.byteLength);
	}

	fromSchema(schema, currentData) {
		const {type, size, index, cases, properties, items} = schema;
		const keys = properties ? Object.keys(properties) : [];

		switch (type) {
			case 'object': {
				const data = {};
				for (const key of keys) {
					data[key] = this.fromSchema(properties[key], data);
				}
				return data;
			}

			case 'array': {
				const length = size || this.uint8();
				return Array.from({length}, () => this.fromSchema(items, currentData));
			}

			case 'switch': {
				return this.fromSchema(cases[get(currentData, index)], currentData);
			}

			default: {
				return this[type](size);
			}
		}
	}
}

export default Decompiler;
