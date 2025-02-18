export default class SortableTable {
  element = document.createElement('div');
  constructor(headerConfig = [], data = []) {
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
    headerConfig.forEach((obj) => {
      const headCell = document.createElement('div');
      headCell.className = 'sortable-table__cell';
      headCell.dataset.id = obj.id;
      headCell.dataset.sortable = obj.sortable;
      headCell.dataset.order = '';
      headCell.appendChild('span').textContent = obj.title;
      this.element.querySelector('[data-element=\'header\']').append(divEl);
    });
    data.forEach((obj) => {
      const dataRow = document.createElement('a');
      dataRow.setAttribute('href', '/product/' + obj.id);
      dataRow.className = 'sortable-table__row';
      this.element.querySelector('[data-element=\'header\']').children
    });



  }
}