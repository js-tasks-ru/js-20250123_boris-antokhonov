import fetchJson from './utils/fetch-json.js';
import SortableTablev2 from '../../06-events-practice/1-sortable-table-v2/index.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable extends SortableTablev2 {
  constructor(headerConfig, {url, isSortLocally = false, data = [], sorted = {}} = {}) {
    super(headerConfig, {data});
    this.isSortLocally = isSortLocally;
    this.fetchData({url, sortCol: sorted.id, sortOrder: sorted.order, start: 0, end: 30}).
    then((dataObj) => 
    {this.dataProp = Object.values(dataObj);
      this.render();}
    );

  }

  async fetchData(options) {
    const fullURL = new URL(options.url, BACKEND_URL);
    fullURL.searchParams.append('_sort', options.sortCol);
    fullURL.searchParams.append('_order', options.sortOrder);
    fullURL.searchParams.append('_start', options.start);
    fullURL.searchParams.append('_end', options.end);
    const resp = await fetch(fullURL.toString(), {method: 'GET'});
    return await resp.json();    
  }

  render() {
    super.constructBody();
  }

  sortOnClient(col, order) {
    super.sort(col, order);
  }

  sortOnServer (col, order) {

  }
}
