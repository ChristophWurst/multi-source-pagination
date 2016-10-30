/*
 * The MIT License
 *
 * Copyright 2016 Christoph Wurst <christoph@winzerhof-wurst.at>.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

class SimpleAPI {

	/**
	 * @param {string} name
	 * @param {Number} data
	 * @returns {SimpleAPI}
	 */
	constructor(name, data) {
		this._name = name;
		this._data = data;
		this._data = this._data.sort((a, b) => a - b);
	}

	getName() {
		return this._name;
	}

	/**
	 * @param {Number} max
	 * @param {Number} pageSize
	 * @returns {Promise}
	 */
	get(max = 0, pageSize = 5) {
		return new Promise((resolve) => {
			resolve(this._data.filter(x => x >= max).slice(0, pageSize));
		});
	}

	leakResults() {
		return this._data;
	}

}
