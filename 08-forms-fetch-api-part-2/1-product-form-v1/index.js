import escapeHtml from './utils/escape-html.js';
import fetchJson from './utils/fetch-json.js';

const IMGUR_CLIENT_ID = '28aaa2e823b03b1';
const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ProductForm {
  element;
  status = new Map([
    [1, 'Активен'],
    [2, 'Неактивен']
  ]);
  product = {price: 100, discount: 0, quantity: 1};
  productId;

  get subElements() {
    return {
      productForm: this.element.querySelector('[data-element=\'productForm\']'),
      imageListContainer: this.element.querySelector('[data-element=\'imageListContainer\']')
    };
  }

  constructor (productId) {
    this.productId = productId;
    
  }      

  async render () {
    const categoryTempl = await this.constructCategory(); //for Node js mock goes first     
    if (this.productId) {
      const respArr = Object.values(await this.fetchData('/api/rest/products', {id: this.productId}, {method: 'GET'}));
      this.product = respArr.length > 0 ? respArr[0] : this.product;
    }
    this.element = document.createElement('div');
    this.element.className = 'product-form';
    this.element.innerHTML = `<form data-element='productForm' class='form-grid'>                              
                                  <div class='form-group form-group__half_left'>
                                      <fieldset>
                                          <label class='form-label'>Название товара</label>
                                          <input required='' type='text' id='title' class='form-control' placeholder='Название товара' value='${this.escapeHtmlStr(this.product.title)}'>
                                      </fieldset>
                                  </div>
                                  <div class='form-group form-group__wide'>
                                      <label class='form-label'>Описание</label>
                                      <textarea required='' class='form-control' id='description' data-element='productDescription' placeholder='Описание товара'>${this.escapeHtmlStr(this.product.description)}</textarea>
                                  </div>
                                  <div class='form-group form-group__wide' data-element='sortable-list-container'>
                                      <label class='form-label'>Фото</label>
                                      <div data-element='imageListContainer'>
                                      
                                      </div>

                                  </div>
                                  <div class='form-group form-group__half_left'>
                                      <label class='form-label'>Категория</label>
                                      <select class='form-control' id='subcategory'>

                                      </select>
                                  </div>
                                  <div class='form-group form-group__half_left form-group__two-col'>
                                      <fieldset>
                                          <label class='form-label'>Цена ($)</label>
                                          <input required='' type='number' id='price' class='form-control' placeholder='100' value='${this.escapeHtmlStr(this.product.price)}'>
                                      </fieldset>
                                      <fieldset>
                                          <label class='form-label'>Скидка ($)</label>
                                          <input required='' type='number' id='discount' class='form-control' placeholder='0' value='${this.escapeHtmlStr(this.product.discount)}'>
                                      </fieldset>
                                  </div>
                                  <div class='form-group form-group__part-half'>
                                      <label class='form-label'>Количество</label>
                                      <input required='' type='number' class='form-control' id='quantity' placeholder='1' value='${this.escapeHtmlStr(this.product.quantity)}'>
                                  </div>
                                  <div class='form-group form-group__part-half'>
                                      <label class='form-label'>Статус</label>
                                      <select class='form-control' id='status'>

                                      </select>
                                  </div>
                                  <div class='form-buttons'>
                                      <button type='submit' id='save' class='button-primary-outline'>
                                          Сохранить товар
                                      </button>
                                  </div>
                              </form>`;
    this.element.querySelector('#subcategory').innerHTML = categoryTempl;
    this.constructImages();
    this.constructStatus();        
    this.createListeners();    
    return this.element;
  }

  async constructCategory() {
    let templ = '';
    this.category = Object.values(await this.fetchData('/api/rest/categories', {_sort: 'weight', _refs: 'subcategory'}, {method: 'GET'}));
    this.category.forEach((el) => {
      el.subcategories.forEach((subel) => {
        templ += `<option value='${this.escapeHtmlStr(subel.id)}' selected='${this.escapeHtmlStr(subel.id === this.product.subcategory ? 'selected' : '')}'>
                  ${this.escapeHtmlStr(el.title)} > ${this.escapeHtmlStr(subel.title)}
                  </option>`;
      });      
    });
    return templ;
  }

  async fetchData(url, urlParams, params) {
    const fullURL = new URL(url, BACKEND_URL);
    for (const [key, val] of Object.entries(urlParams)) {
      fullURL.searchParams.append(key, val);
    }
    return await fetchJson(fullURL, params);
  }

  constructImages() {
    let templ = `<ul class='sortable-list' id='imageList'>`;
    this.product.images.forEach((el) => {
      templ += this.constructImage(this.escapeHtmlStr(el.url), this.escapeHtmlStr(el.source));
    });                  
    templ += '</ul>';
    this.element.querySelector('[data-element=\'imageListContainer\']').innerHTML = templ;
    const loadBtn = document.createElement('div');
    loadBtn.innerHTML = `<label class='button-primary-outline' for="uploadImage">Загрузить</label>
                        <input type='file' accept='image/*' id='uploadImage' name='uploadImage' style='opacity: 0;' multiple></input>`;
    this.element.querySelector('[data-element=\'sortable-list-container\']').append(loadBtn);
  }

  constructImage(url, source) {
    return `<li class='products-edit__imagelist-item sortable-list__item' style=''>
            <input type='hidden' id='url' value='${url}'>
            <input type='hidden' id='source' value='${source}'>
            <span>
                <img src='icon-grab.svg' data-grab-handle='' alt='grab'>
                <img class='sortable-table__cell-img' alt='Image' src='${url}'>
                <span>${source}</span>
            </span>
            <button type='button'>
                <img src='icon-trash.svg' data-delete-handle='' alt='delete'>
            </button>
            </li>`;
  }
  
  constructStatus() {
    let templ = '';
    for (const [key, val] of this.status) {
      templ += `<option value='${this.escapeHtmlStr(key)}' selected='${this.escapeHtmlStr(key === this.product.status ? 'selected' : '')}'>${this.escapeHtmlStr(val)}</option>`;
    }
    this.element.querySelector('[id=\'status\']').innerHTML = templ;
  }

  createListeners() {
    this.element.querySelector('[id=\'save\']').addEventListener('click', this.save);
    this.element.querySelector('#uploadImage').addEventListener('change', this.uploadImage);
  }

  save = function() {
    const formCtrls = Array.from(this.subElements.productForm.elements);
    const formFields = formCtrls.filter((ctrl) => Object.keys(this.product).some((key) => key == ctrl.id));
    formFields.forEach((field) => {
      this.product[field.id] = field.value;
    });
    const imgCtrls = document.getElementsByClassName('products-edit__imagelist-item');
    for (let i = 0; i < imgCtrls.length; i++) {
      this.product.images[i].url = imgCtrls[i].children.url.value;
      this.product.images[i].source = imgCtrls[i].children.source.value;
    }
    const resp = this.fetchData('/api/rest/products', {}, {
      method: this.productId ? 'PATCH' : 'PUT', 
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.product)
    });
    return resp.then(() => {
      if (this.productId) {
      
        this.element.dispatchEvent(new Event('product-updated'));
      }
      else {
        this.element.dispatchEvent(new Event('product-saved'));
      }
    });
  }.bind(this);

  uploadImage = function(event) {
    const fileObj = event.currentTarget.files[0];
    if (fileObj) {
      this.fetchData('https://api.imgur.com/3/image', {}, {method: 'POST', headers: {
        Authorization: "Client-ID 28aaa2e823b03b1"
      },
      body: fileObj    
      }).then((respObj) => {
        const tmpl = document.createElement('template');
        tmpl.innerHTML = this.constructImage(respObj.data.link, fileObj.name);
        this.element.querySelector('#imageList').append(tmpl.content.children[0]);
      }); 
    }
  }.bind(this);

  escapeHtmlStr(arG) {
    return escapeHtml(String(arG));
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.element.querySelector('[id=\'save\']').removeEventListener('click', this.save);
    this.remove();
  }
}