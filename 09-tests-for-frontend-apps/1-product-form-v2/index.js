import SortableList from '../2-sortable-list/index.js';
import escapeHtml from './utils/escape-html.js';
import fetchJson from './utils/fetch-json.js';
import ProductFormv1 from '../../08-forms-fetch-api-part-2/1-product-form-v1/index.js';

const IMGUR_CLIENT_ID = '28aaa2e823b03b1';
const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ProductForm extends ProductFormv1 {
  sortableList = {};
  constructor (productId) {
    super(productId);
  }

  async render () {
    await super.render();
    const imageList = this.element.querySelector('#imageList');
    this.sortableList = new SortableList({items: Array.from(imageList.children)});
    imageList.remove();
    this.element.querySelector('[data-element=\'imageListContainer\']').append(this.sortableList.element);
    return this.element;
  }
}
