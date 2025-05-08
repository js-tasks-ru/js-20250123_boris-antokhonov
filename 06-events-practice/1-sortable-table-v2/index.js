import SortableTablev1 from '../../05-dom-document-loading/2-sortable-table-v1/index.js';

export default class SortableTable extends SortableTablev1 {
  sortableArr = [];
  isSortLocally = true;
  sortedCol = {};
  arrowEl = {};

  constructor(headerConfig, {data = [], sorted = {}} = {}) {
    super(headerConfig, data);
    this.arrowEl = this.createArrowElement();
    if (sorted.id) {
      this.sort(sorted.id, sorted.order);
    }

    this.sortableArr = this.element.querySelectorAll('[data-sortable=\'true\']');
    this.sortableArr.forEach(function(el) {
      el.addEventListener('pointerdown', this.sortHandler);
    }, this);
  }

  createArrowElement() {
    const el = document.createElement('div');
    el.innerHTML = `
    <span data-element='arrow' class='sortable-table__sort-arrow'>
    <span class='sort-arrow'></span>
    </span>    
    `;
    return el.firstElementChild;
  }  

  sort(col, order = 'asc') {
    super.sort(col, order);
    if (this.sortedCol.dataset) {
      this.sortedCol.dataset.order = '';
    }
    this.sortedCol = this.element.querySelector(`[data-id='${col}']`);
    this.sortedCol.dataset.order = order;
    this.sortedCol.append(this.arrowEl);    
  }

  sortHandler = function(e) {
    this.sort(e.currentTarget.dataset.id, e.currentTarget.dataset.order === 'desc' ? 'asc' : 'desc');
  }.bind(this);

  destroy() {
    this.sortableArr.forEach(function(el) {
      el.removeEventListener('pointerdown', this.sortHandler);
    }, this);
    super.destroy();
  }

}