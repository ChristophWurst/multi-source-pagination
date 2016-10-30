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

/* global Promise */

class Paginator {
	/**
	 * @param {array} sources
	 * @param {Number} pageSize
	 * @returns {Paginator}
	 */
	constructor(sources = [], pageSize = 5) {
		this._sources = sources;
		this._pageSize = pageSize;
		this._max = {};
		this._data = {};
		this._combined = [];
		this._sources.forEach((source) => {
			this._max[source.getName()] = 0;
			this._data[source.getName()] = [];
		});
	}

	/**
	 * @param {Number} nr
	 * @returns {Promise}
	 */
	getPage(nr, fetches = 0) {
		return new Promise((resolve, reject) => {
			const offset = (nr - 1) * this._pageSize;
			const nextPage = this._combined.slice(offset, offset + this._pageSize);

			console.log('loading page ' + nr + ' with offset=' + offset);
			console.log('existing data:', this._combined);
			console.log('possible next page:', nextPage);

			var toFetch = [];
			if (nextPage.length === 0) {
				// Nothing loaded yet
				toFetch = this._sources;
			} else {
				const max = nextPage[nextPage.length - 1];

				toFetch = this._sources.filter(s => {
					return this._max[s.getName()] <= max;
				});
			}

			if (toFetch.length === 0) {
				resolve([nextPage, fetches]);
				return;
			}

			const sizeBefore = this._combined.length;
			Promise.all(toFetch.map((source) => {
				return new Promise((resolve, reject) => {
					const max = this._max[source.getName()];
					console.log('fetching ' + source.getName() + ', max=' + max);
					source.get(max, this._pageSize + 1).then((data) => {
						console.log(source.getName() + ' fetched', data);
						if (data.length !== 0) {
							const max = data[data.length - 1];
							data = data.slice(0, data.length - 1);
							this._combined = this._combined.concat(data);
							this._data[source.getName()] = this._data[source.getName()].concat(data);
							this._max[source.getName()] = max;
						}
						resolve();
					}).catch(reject);
				});
			})).then(() => {
				this._combined = this._combined.sort((a, b) => a - b);
				if (this._combined.length === sizeBefore) {
					// Nothing fetched, which means we have reached the end of
					// all sources
					resolve([nextPage, fetches]);
				} else {
					resolve(this.getPage(nr, fetches + toFetch.length));
				}
			}).catch(() => {
				reject();
			});
		});
	}
}
