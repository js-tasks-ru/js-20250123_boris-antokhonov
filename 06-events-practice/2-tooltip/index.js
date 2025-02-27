class Tooltip {
  static instance;
  element = document.createElement('div');
  queryEl = {};
  constructor (prop = 'My tooltip') {
    if (Tooltip.instance) {
      return Tooltip.instance;
    }
    this.element.className = 'tooltip';
    this.element.textContent = prop;
    Tooltip.instance = this;
  }

  initialize () {
    this.queryEl = document.querySelector('[data-tooltip]');
    this.queryEl.addEventListener('pointerover', this.render);
    this.queryEl.addEventListener('pointerout', this.remove);
    this.queryEl.addEventListener('pointermove', this.updatePostn);
  }

  render = function(event) {
    this.element.textContent = event.target?.dataset.tooltip;
    this.element.style.top = event.clientY + 'px';
    this.element.style.left = event.clientX + 'px';
    document.body.append(this.element);
  }.bind(this);

  updatePostn = function(event) {
    this.element.style.top = event.clientY + 'px';
    this.element.style.left = event.clientX + 'px';    
  }.bind(this);

  remove = function() {
    this.element.remove();
  }.bind(this);

  destroy() {
    this.queryEl.removeEventListener('pointerover', this.render);
    this.queryEl.removeEventListener('pointerout', this.remove);
    this.queryEl.removeEventListener('pointermove', this.updatePostn);      
    this.remove();
    Tooltip.instance = void (0);
  }

}  

export default Tooltip;
