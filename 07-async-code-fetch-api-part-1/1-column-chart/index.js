import fetchJson from './utils/fetch-json.js';
import ColumntChartv1 from '../../04-oop-basic-intro-to-dom/1-column-chart/index.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart extends ColumntChartv1 {
  label;
  constructor(options) {
    super(options);
    this.element.innerHTML = this.element.querySelector('[class=\'column-chart\'').outerHTML; //bandaid
    this.url = options.url;
    this.label = options.label;
    this.getData(options).
    then((resp) => resp.json()).
    then((dataObj) => this.update('', '', Object.values(dataObj)));
      


  }

  getData (options) {
    const fullURL = new URL(options.url, BACKEND_URL);
    fullURL.searchParams.append('from', options.range.from.toJSON());
    fullURL.searchParams.append('to', options.range.to.toJSON());
    return fetch(fullURL, {method: 'GET'});
  }

  update(from, to, newdata) {
    if (newdata === undefined) {  
      this.getData({
        url: this.url, range: {from: from, to: to}
      }).
          then((resp) => resp.json()).
          then((dataObj) => super.update('', '', Object.values(dataObj)));
    }
    else {
      super.update(newdata);
    }
    this.element.innerHTML = this.element.querySelector('[class=\'column-chart\'').outerHTML; //bandaid
    this.element.className = '';
    document.getElementById(this.label).append(this.element);
    
  }


}
