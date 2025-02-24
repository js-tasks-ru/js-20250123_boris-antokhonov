class Tooltip {
  static instance;
  element = document.createElement('div');
  constructor (prop = 'My tooltip') {
    if (Tooltip.instance) {
      return Tooltip.instance;
    }
    this.element.className = 'tooltip';
    this.element.textContent = prop;
    Tooltip.instance = this;  
  }

  initialize () {
    const foo = document.querySelector('[data-tooltip]');
    foo.addEventListener('pointerover', (e) => this.render(e));
    foo.addEventListener('pointerout', (e) => this.remove(e));
    foo.addEventListener('pointermove', (event) => {
      this.element.style.top = event.clientY + 'px';
      this.element.style.left = event.clientX + 'px';
    });
  }

  render(event) {
    this.element.textContent = event.target?.dataset.tooltip;
    this.element.style.top = event.clientY + 'px';
    this.element.style.left = event.clientX + 'px';
    document.body.append(this.element);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    Tooltip.instance = void (0);
  }

}  

export default Tooltip;
