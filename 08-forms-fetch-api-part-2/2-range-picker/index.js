export default class RangePicker {
    element = document.createElement('div');
    selDate;
    from; to; rangePickers;
    set setFrom(dt) {
      this.from = dt;
      this.element.querySelector('[data-element=\'from\']').textContent = dt.toLocaleDateString('ru-RU');
    }
    set setTo(dt) {
      this.to = dt;
      this.element.querySelector('[data-element=\'to\']').textContent = dt.toLocaleDateString('ru-RU');
    }    
    monthArr = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'];
    clickCnt = 0;
    constructor({from, to}) {
      this.calculatePickers(new Date(to));
      this.render();
      this.setFrom = from;
      this.setTo = to;
      this.element.querySelector('[data-element=\'input\']').addEventListener('click', this.renderRP);
    }
    calculatePickers(to) {
      this.rightPicker = new Date(to);
      this.rightMth = this.monthArr[to.getMonth()];
      to.setMonth(to.getMonth() - 1);
      this.leftPicker = new Date(to);
      this.leftMth = this.monthArr[to.getMonth()];                
    }    
    render() {
      this.element.className = 'rangepicker';
      this.element.innerHTML = `<div class='rangepicker__input' data-element='input'>
                                    <span data-element='from'></span> -
                                    <span data-element='to'></span>
                                </div>
                                <div class='rangepicker__selector' data-element='selector'></div>`;
    }
    renderRP = function() {
      const el = this.element.querySelector('[data-element=\'selector\']');
      if(el.innerHTML === ''){
        this.element.classList.add('rangepicker_open');
        el.innerHTML = `<div class='rangepicker__selector-arrow'></div>
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
                        </div>`;
        this.rangePickers = this.element.getElementsByClassName('rangepicker__date-grid');
        this.renderMonth(this.rangePickers[0], new Date(this.leftPicker));
        this.renderMonth(this.rangePickers[1], new Date(this.rightPicker)); 
        this.createListeners();   
      }
      else if(document.getElementsByClassName('rangepicker_open').length === 0) {
        this.element.classList.add('rangepicker_open');
      }
      else {
        this.element.classList.remove('rangepicker_open');
      }                                                                   
    }.bind(this);
    renderMonth(el, dt) {
      let templ = '';
      const currentDt = dt;
      const currentMth = dt.getMonth();
      currentDt.setDate(1);
      while (currentDt.getMonth() === currentMth) {
        let selClass = '';
        if(currentDt.toJSON() === this.from?.toJSON()) {
          selClass = ' rangepicker__selected-from';
        }
        else if(currentDt.toJSON() === this.to?.toJSON()) {
          selClass = ' rangepicker__selected-to';
        }
        else if(currentDt < this.to && currentDt > this.from) {
          selClass = ' rangepicker__selected-between';
        }
        templ += `<button type='button' class='rangepicker__cell${selClass}'
                    data-value='${currentDt.toJSON()}'
                    style='--start-from: ${currentDt.getDay() === 0 ? 7 : currentDt.getDay()}'>${currentDt.getDate()}</button>`;
        currentDt.setDate(currentDt.getDate() + 1);
      }
      el.innerHTML = templ;
    }
    createListeners() {
      this.element.getElementsByClassName('rangepicker__selector-control-left')[0].addEventListener('click', this.shiftMonth);
      this.element.getElementsByClassName('rangepicker__selector-control-right')[0].addEventListener('click', this.shiftMonth);
      this.element.getElementsByClassName('rangepicker__date-grid')[0].addEventListener('click', this.selectDate);
      this.element.getElementsByClassName('rangepicker__date-grid')[1].addEventListener('click', this.selectDate);
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
    selectDate = function(event) {
      this.clickCnt = (this.clickCnt + 1) % 2;

      if (this.clickCnt === 1) {
        const allCells = this.element.getElementsByClassName('rangepicker__cell');
        for (let i = 0; i < allCells.length; i++) { //reset classes
          allCells[i].className = 'rangepicker__cell';
        }
        this.selDate = new Date(event.target.dataset.value);
        event.target.classList.add('rangepicker__selected');
      }
      else {
        const dt1 = new Date(this.selDate);
        const dt2 = new Date(event.target.dataset.value);
        if (dt1 < dt2) {
          this.setFrom = new Date(dt1);
          this.setTo = new Date(dt2);
          dt1.setDate(dt1.getDate() + 1);
          do {
            this.element.querySelector(`[data-value='${dt1.toJSON()}']`)?.classList.add('rangepicker__selected-between');
            dt1.setDate(dt1.getDate() + 1);
          } while (dt1 < dt2);
          this.element.getElementsByClassName('rangepicker__selected')[0]?.classList.add('rangepicker__selected-from');
          event.target.classList.add('rangepicker__selected-to');
        }
        else if (dt1 > dt2) {
          this.setFrom = new Date(dt2);
          this.setTo = new Date(dt1);
          dt2.setDate(dt2.getDate() + 1);
          do {
            this.element.querySelector(`[data-value='${dt2.toJSON()}']`)?.classList.add('rangepicker__selected-between');
            dt2.setDate(dt2.getDate() + 1);
          } while (dt2 < dt1);
          event.target.classList.add('rangepicker__selected-from');
          this.element.getElementsByClassName('rangepicker__selected')[0]?.classList.add('rangepicker__selected-to');
        }
        else {
          this.setFrom = new Date(this.selDate);
          this.setTo = new Date(this.selDate);
          event.target.classList.add('rangepicker__selected-from');
          event.target.classList.add('rangepicker__selected-to');
        }
        this.element.dispatchEvent(new Event('date-select'));
      }
    }.bind(this);
    destroyListeners() {
      this.element.getElementsByClassName('rangepicker__selector-control-left')[0].removeEventListener('click', this.shiftMonth);
      this.element.getElementsByClassName('rangepicker__selector-control-right')[0].removeEventListener('click', this.shiftMonth);
      this.element.getElementsByClassName('rangepicker__date-grid')[0].removeEventListener('click', this.selectDate);
      this.element.getElementsByClassName('rangepicker__date-grid')[1].removeEventListener('click', this.selectDate);      
    }
    remove() {
      this.element.remove();
    }
    destroy() {
      if(this.element.querySelector('[data-element=\'selector\']').innerHTML != '') {
        this.destroyListeners();
      }
      this.element.querySelector('[data-element=\'input\']').removeEventListener('click', this.renderRP);
      this.remove();
    }
    
}
