export default class SortableList {
    element = '';
    ptrScreenX = 0;
    ptrScreenY = 0;
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
      document.addEventListener('pointerup', this.releaseElem);
      document.addEventListener("load", function(e) {
        this.listScreenY = this.calcListScreenY(this.element);
      });
    }

    deleteElem = function(e) {
      const currElem = this.closest('li');
      currElem.remove();
    };

    grabElem = function(event) {
      const currElem = event.currentTarget.closest('li');
      const placeHold = document.createElement('div');
      placeHold.className = 'sortable-list__placeholder';
      placeHold.style = 'width: 800px; height: 60px;';
      currElem.after(placeHold);
      currElem.classList.add('sortable-list__item_dragging');
      currElem.style = 'width: 800px; height: 60px;';
      this.ptrScreenX = event.screenX;
      this.ptrScreenY = event.screenY;
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
      currElem.style = `width: 800px; height: 60px; left: ${currElem.offsetLeft + event.screenX - this.ptrScreenX}px; top: ${currElem.offsetTop + event.screenY - this.ptrScreenY}px;`;
      this.ptrScreenX = event.screenX;
      this.ptrScreenY = event.screenY;
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
      document.removeEventListener('pointerup', this.releaseElem);
      this.remove();
    }

    remove() {
      this.element.remove();
    }
}
