export default class RangePicker {
    element = document.createElement('div');
    from; to; rangePickers;
    monthArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    constructor({from, to}) {
      this.from = from;
      this.to = to;
      this.calculatePickers(new Date(to));
      this.render();
      this.createListeners();
    }
    calculatePickers(to) {
      this.rightPicker = new Date(to);
      this.rightMth = this.monthArr[to.getMonth()];
      to.setMonth(to.getMonth() - 1);
      this.leftPicker = new Date(to);
      this.leftMth = this.monthArr[to.getMonth()];                
    }    
    render() {
      this.element.className = 'rangepicker rangepicker_open';
      this.element.innerHTML = `<div class='rangepicker__input' data-element='input'>
                                    <span data-element='from'>${this.from.toLocaleDateString()}</span> -
                                    <span data-element='to'>${this.to.toLocaleDateString()}</span>
                            </div>
                            <div class='rangepicker__selector' data-element='selector'>
                                    <div class='rangepicker__selector-arrow'></div>
                                    <div class='rangepicker__selector-control-left'></div>
                                    <div class='rangepicker__selector-control-right'></div>
                                    <div class='rangepicker__calendar'>
                                            <div class='rangepicker__month-indicator'>
                                                    <time datetime='${this.leftMth}'>${this.leftMth}</time>
                                            </div>
                                            <div class='rangepicker__day-of-week'>
                                                    <div>Пн</div>
                                                    <div>Вт</div>
                                                    <div>Ср</div>
                                                    <div>Чт</div>
                                                    <div>Пт</div>
                                                    <div>Сб</div>
                                                    <div>Вс</div>
                                            </div>
                                            <div class='rangepicker__date-grid'>
                                            
                                            </div>
                                    </div>
                                    <div class='rangepicker__calendar'>
                                            <div class='rangepicker__month-indicator'>
                                                    <time datetime='${this.rightMth}'>${this.rightMth}</time>
                                            </div>
                                            <div class='rangepicker__day-of-week'>
                                                    <div>Пн</div>
                                                    <div>Вт</div>
                                                    <div>Ср</div>
                                                    <div>Чт</div>
                                                    <div>Пт</div>
                                                    <div>Сб</div>
                                                    <div>Вс</div>
                                            </div>
                                            <div class='rangepicker__date-grid'>
                                            
                                            </div>
                                    </div>
                            </div>`;
      this.rangePickers = this.element.getElementsByClassName('rangepicker__date-grid');
      this.renderMonth(this.rangePickers[0], new Date(this.leftPicker));
      this.renderMonth(this.rangePickers[1], new Date(this.rightPicker));   
    }
    renderMonth(el, dt) {
      let templ = '';
      const currentDt = dt;
      const currentMth = dt.getMonth();
      currentDt.setDate(1);
      while (currentDt.getMonth() === currentMth) {
        templ += `<button type='button' class='rangepicker__cell'
                    data-value='${currentDt.toJSON()}'
                    style='--start-from: ${currentDt.getDay() === 0 ? 7 : currentDt.getDay()}'>${currentDt.getDate()}</button>`;
        currentDt.setDate(currentDt.getDate() + 1);
      }
      el.innerHTML = templ;
    }
    createListeners() {
      this.element.getElementsByClassName('rangepicker__selector-control-left')[0].addEventListener('click', this.shiftMonth);
      this.element.getElementsByClassName('rangepicker__selector-control-right')[0].addEventListener('click', this.shiftMonth);
    }
    shiftMonth = function(event) {
      const dt = new Date(this.rightPicker);
      if (event.currentTarget.className === 'rangepicker__selector-control-left')
      {
        dt.setMonth(dt.getMonth() - 1);
      }
      else
      {
        dt.setMonth(dt.getMonth() + 1);
      }
      this.calculatePickers(dt);
      const monthInds = this.element.getElementsByClassName('rangepicker__month-indicator');
      monthInds[0].innerHTML = `<time datetime='${this.leftMth}'>${this.leftMth}</time>`;
      monthInds[1].innerHTML = `<time datetime='${this.rightMth}'>${this.rightMth}</time>`;
      this.renderMonth(this.element.getElementsByClassName('rangepicker__date-grid')[0], new Date(this.leftPicker));
      this.renderMonth(this.element.getElementsByClassName('rangepicker__date-grid')[1], new Date(this.rightPicker));
    }.bind(this);
    remove() {
      this.element.remove();
    }
    destroy() {
      this.element.getElementsByClassName('rangepicker__selector-control-left')[0].removeEventListener('click', this.shiftMonth);
      this.element.getElementsByClassName('rangepicker__selector-control-right')[0].removeEventListener('click', this.shiftMonth);
      this.remove();
    }
    
}
