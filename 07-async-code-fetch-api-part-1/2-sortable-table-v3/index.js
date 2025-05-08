import fetchJson from './utils/fetch-json.js';
import SortableTablev2 from '../../06-events-practice/1-sortable-table-v2/index.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable extends SortableTablev2 {
  url = '';
  sorted = {};
  start = 0;
  constructor(headerConfig, {url, isSortLocally = false, data = [], sorted = {}} = {}) {
    super(headerConfig, {data});
    this.isSortLocally = isSortLocally;
    this.url = url;
    this.sort(sorted.id, sorted.order);
    this.showDummy(); //load indicator
    document.addEventListener('scroll', this.scrollHandler);
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

  async render(start = 0, end = 30) {    
    this.start = start;
    const dataObj = await this.fetchData({url: this.url, sortCol: this.sorted.id, sortOrder: this.sorted.order, start, end});
    this.dataProp = Object.values(dataObj);
    if (this.dataProp.length == 0) {
      this.showDummy('Data from the server is empty');
    }
    else {
      this.element.querySelector(['#dummy'])?.remove();
      super.constructBody();
    }
  }

  scrollHandler = function(event) {
    const docEl = document.documentElement;
    if (Math.abs(docEl.scrollHeight - docEl.clientHeight - docEl.scrollTop) <= 1) {
      this.render(this.start + 30, this.start + 60);
    }
  }.bind(this);

  showDummy(text = 'Loading...') {
    if (this.tbody.children.length === 0) {
      this.tbody.innerHTML = `<span id='dummy'>${text}</span>`;
    }
  }

  sort(col, order = 'asc') {
    if (this.isSortLocally) {
      this.sortOnClient(col, order);
    }
    else {
      this.sortOnServer(col, order);
    }
  }

  sortOnClient(col, order) {
    super.sort(col, order);
  }

  sortOnServer (col, order) {
    this.sorted = {id: col, order: order};
    this.tbody.innerHTML = ''; //delete rows   
    this.render().
    then(() => {
      if (col) {
        if (this.sortedCol.dataset) {
          this.sortedCol.dataset.order = '';
        }
        this.sortedCol = this.element.querySelector(`[data-id='${col}']`);
        this.sortedCol.dataset.order = order;
        this.sortedCol.append(this.arrowEl);
      }
    }); 
  }

  destroy() {
    document.removeEventListener('scroll', this.scrollHandler);
    super.destroy();
  }
}
