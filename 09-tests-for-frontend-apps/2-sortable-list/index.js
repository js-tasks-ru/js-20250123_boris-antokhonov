export default class SortableList {
    element = '';
    grabScreenX = 0;
    grabScreenY = 0;
    listScreenY = 0;
    deleteIcons = {};
    grabIcons = {};
    constructor({items}) {
      this.element = document.createElement('ul');
      this.element.className = 'sortable-list';
      this.element.innerHTML = items.reduce((prev, curr, i) => {
        curr.className = 'products-edit__imagelist-item sortable-list__item';  
        return prev += curr.outerHTML;
      }, '');
      this.deleteIcons = this.element.querySelectorAll('[data-delete-handle=\'\']');
      this.deleteIcons.forEach((el) => el.addEventListener('pointerdown', this.deleteElem));
      this.grabIcons = this.element.querySelectorAll('[data-grab-handle=\'\']');
      this.grabIcons.forEach((el) => el.addEventListener('pointerdown', this.grabElem));
      this.grabIcons.forEach((el) => el.addEventListener('dragstart', (e) => e.preventDefault()));
      document.addEventListener('pointerup', this.releaseElem);
    }

    deleteElem = function(e) {
      const currElem = this.closest('li');
      currElem.remove();
    };

    grabElem = function(event) {
      if (this.listScreenY === 0) {
        this.listScreenY = this.calcListScreenY(this.element);
      }
      const currElem = event.currentTarget.closest('li');
      const placeHold = document.createElement('div');
      placeHold.className = 'sortable-list__placeholder';
      placeHold.style = 'width: 800px; height: 60px;';
      currElem.after(placeHold);
      currElem.classList.add('sortable-list__item_dragging');
      currElem.style = 'width: 800px; height: 60px;';
      this.grabScreenX = event.screenX;
      this.grabScreenY = event.screenY;
      document.addEventListener('pointermove', this.updatePostn);
    }.bind(this);

    releaseElem = function(event) {
      const currElem = document.querySelector('.sortable-list__item_dragging');
      if (currElem) {
        document.removeEventListener('pointermove', this.updatePostn);
        currElem.style = '';
        currElem.classList.remove('sortable-list__item_dragging');
        this.element.querySelector('.sortable-list__placeholder').remove();
      }
    }.bind(this);

    updatePostn = function(event) {
      const currElem = document.querySelector('.sortable-list__item_dragging');
      currElem.style = `width: 800px; height: 60px; left: ${currElem.offsetLeft + event.screenX - this.grabScreenX}px; top: ${currElem.offsetTop + event.screenY - this.grabScreenY}px;`;
      this.grabScreenX = event.screenX;
      this.grabScreenY = event.screenY;
      if (currElem.offsetTop - this.listScreenY > currElem.nextSibling?.nextSibling?.offsetTop) {
        currElem.before(currElem.nextSibling.nextSibling);
      }
      else if (currElem.offsetTop - this.listScreenY < currElem.previousSibling?.offsetTop) {
        currElem.nextSibling.after(currElem.previousSibling);
      }
    }.bind(this);

    calcListScreenY(el) {
      if (el) {
        return el.offsetTop + this.calcListScreenY(el.offsetParent);
      }
      else {
        return 0;
      }    
    }    

    destroy() {
      this.deleteIcons.forEach((el) => el.removeEventListener('pointerdown', this.deleteElem));
      this.grabIcons.forEach((el) => el.removeEventListener('pointerdown', this.grabElem));
      this.grabIcons.forEach((el) => el.removeEventListener('pointerup', this.releaseElem));
      this.remove();
    }

    remove() {
      this.element.remove();
    }
}
