export default class SortableTable {
  element = document.createElement('div');
  dataProp = [];
  headConfProp = [];
  theader = {};
  tbody = {};
  constructor(headerConfig = [], data = []) {
    this.headConfProp = headerConfig;
    this.dataProp = data;
    this.element.dataset.element = 'productsContainer';
    this.element.className = 'products-list__container';
    this.element.innerHTML = `
    <div class="sortable-table">
      <div data-element="header" class="sortable-table__header sortable-table__row">
      </div>
      <div data-element="body" class="sortable-table__body">
      </div>
      <div data-element="loading" class="loading-line sortable-table__loading-line"></div>
      <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
      <div>
        <p>No products satisfies your filter criteria</p>
        <button type="button" class="button-primary-outline">Reset all filters</button>
      </div>
      </div>
    </div>
    `;
    this.theader = this.element.querySelector('[data-element=\'header\']');
    this.tbody = this.element.querySelector('[data-element=\'body\']');

    this.headConfProp.forEach((obj) => {
      const headCell = document.createElement('div');
      headCell.className = 'sortable-table__cell';
      headCell.dataset.id = obj.id;
      headCell.dataset.sortable = obj.sortable;
      headCell.dataset.order = '';
      headCell.appendChild(document.createElement('span')).textContent = obj.title;
      this.theader.append(headCell);
    });

    this.constructBody();
  }
  
  constructBody () {
    this.dataProp.forEach((obj) => {
      const dataRow = document.createElement('a');
      dataRow.setAttribute('href', '/product/' + obj.id);
      dataRow.className = 'sortable-table__row';
      for (let i = 0; i < this.headConfProp.length; i++) {
        let rowCell = {};
        if (this.headConfProp[i].id === 'images') {
          const tmpl = document.createElement('template');
          tmpl.innerHTML = this.headConfProp[i].template(obj.images);
          rowCell = tmpl.content.firstElementChild;
        }
        else {
          rowCell = document.createElement('div');          
          rowCell.className = 'sortable-table__cell';
          rowCell.textContent = obj[this.headConfProp[i].id];
        }
        dataRow.append(rowCell);
      }
      this.tbody.append(dataRow);
    });
  }

  sort(col, order = 'asc') {
    const head = this.headConfProp.find((el) => el.id === col);
    const colType = head.sortType;
    const colSortFlg = head.sortable;

    if (colSortFlg === false) {
      return void (0);
    }
    else if (colType === 'string') {
      this.dataProp.sort((next, prev) => {
        return order == 'asc' ? 
          next[col].localeCompare(prev[col], ['ru', 'en'], {sensitivity: 'variant', caseFirst: 'upper'}) :
          prev[col].localeCompare(next[col], ['ru', 'en'], {sensitivity: 'variant', caseFirst: 'upper'});
      });
    }
    else if (colType === 'number') {
      this.dataProp.sort((next, prev) => {
        return order == 'asc' ? 
          next[col] - prev[col] :
          prev[col] - next[col];
      });
    }
    else if (colType === 'date') {
      this.dataProp.sort((next, prev) => {
        return order == 'asc' ?
          new Date(next[col]) > new Date(prev[col]) :
          new Date(prev[col]) > new Date(next[col]);
      });
    }
    else {
      return void (0);
    }

    this.tbody.innerHTML = ''; //delete rows
    this.constructBody(); 
  }

  get subElements() {
    return {header: this.theader, body: this.tbody};
  }

  destroy() {
    this.element.remove();
  }
}