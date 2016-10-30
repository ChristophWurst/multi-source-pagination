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

$(() => {
	const api1 = new SimpleAPI('API 1', [1, 2, 3, 4, 16, 18, 22, 23, 27]);
	const api2 = new SimpleAPI('API 2', [5, 6, 8, 11, 17, 19, 24, 25, 26]);
	const api3 = new SimpleAPI('API 3', [7, 9, 10, 12, 13, 14, 15, 20, 21]);
	const sources = [api1, api2, api3];
	const paginator = new Paginator(sources, 3);
	const visualizer = new PaginationVisualizer(sources)

	var page = 0;

	$('#more').click(() => {
		page++;
		paginator.getPage(page).then(result => {
			const data = result[0];
			const nrFetches = result[1];
			visualizer.onPageLoaded(data, nrFetches);
		}).catch(() => {
			visualizer.onPageLoadFailed();
		});
	});

});
