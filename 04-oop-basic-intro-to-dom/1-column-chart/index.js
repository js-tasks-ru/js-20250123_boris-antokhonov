export default class ColumnChart {
    element = document.createElement('div');


    data = [];
    maxHeight = 0;
    colHgtUnit = 1;
    chartHeight = 50 //getComputedStyle(document.getElementsByClassName('dashboard__charts')[0]).getPropertyValue('--chart-height');
    

    constructor(options) {
      this.data = options.data ? options.data : this.data;
      if (options == undefined) {
        throw (new Error('Error, options argument not supplied!'));
      }

      this.render(options);    
    }

    render(options) {
      this.maxHeight = Math.max(...this.data);
      this.colHgtUnit = this.chartHeight / this.maxHeight;
  
      this.element.innerHTML = `
          <div id='${options.label}' class='dashboard__chart_${options.label}'>
              <div class='column-chart'>
              <div class='column-chart__title'>
                  Total ${options.label}
                  <a class='column-chart__link' href='${options.link}'>View All</a>
              </div>
              <div class='column-chart__container'>
                  <div data-element='header' class='column-chart__header'>${format(options.formatHeading, options.value)}</div>
                  <div data-element='body' class='column-chart__chart'></div>
              </div>
              </div>
          </div>
        `;
  
      if (this.data.length === 0) {
        this.element.getElementsByClassName('column-chart')[0].classList.add('column-chart_loading');
      }
  
      this.data.forEach((val) => {
        const col = this.element.querySelector('[data-element=\'body\']').appendChild(document.createElement('div'));
        col.style.setProperty('--value', val * this.colHgtUnit);
        col.dataset.tooltip = `${val / this.maxHeight}%`;
      });

      function format(cb = (x) => x, y) {
        return cb(y);
      }          
    }
      
    update(newdata) {
      this.destroy();
      this.data = newdata;
      this.render();    
    }

    destroy() {
      this.remove();
    }

    remove() {
      this.element.remove();
    }
}
