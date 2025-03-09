import fetchJson from './utils/fetch-json.js';
import ColumntChartv1 from '../../04-oop-basic-intro-to-dom/1-column-chart/index.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart extends ColumntChartv1 {
  label;
  get subElements() {
    return {
      header: this.element.querySelector("[data-element='header']"),
      body: this.element.querySelector("[data-element='body']")
    };
  }

  constructor(options) {
    super(options);
    this.url = options?.url;
    this.label = options?.label;
    this.getData(options).
    then((dataObj) => this.update('', '', Object.values(dataObj))); 
  }

  async getData (options) {
    const fullURL = new URL(options.url, BACKEND_URL);
    fullURL.searchParams.append('from', options.range?.from.toJSON());
    fullURL.searchParams.append('to', options.range?.to.toJSON());
    const resp = await fetch(fullURL.toString(), {method: 'GET'});
    return await resp.json();
  }

  async update(from, to, newdata) {
    if (newdata === undefined) {  
      newdata = await this.getData({url: this.url, range: {from: from, to: to}});
      super.update(Object.values(newdata));
    }
    else {
      super.update(newdata);
    }
    return newdata;
  }




}
