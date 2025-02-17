export default class NotificationMessage {
  static instObj;
  element = document.createElement('div');
  duration = 0;
  timeOutID;
  
  constructor(message, options) {
    this.duration = options?.duration;
    this.element.style.setProperty('--value', String(this.duration) + 'ms');
    this.element.className = 'notification ' + options?.type;
    this.element.innerHTML = `
    <div class="timer"></div>
    <div class="inner-wrapper">
        <div class="notification-header">${options?.type}</div>
        <div class="notification-body">
        ${message}
        </div>
    </div>
    `;
  }

  show(div) {
    if (NotificationMessage.instObj) {
      NotificationMessage.instObj.remove();
    }
    NotificationMessage.instObj = this;
    if (div) {
      div.append(this.element);
    }
    else {
      document.body.append(this.element);
    }
    //this.element.addEventListener('animationend', () => this.remove()); ???
    this.timeOutID = setTimeout(() => this.remove(), this.duration);
    
  }

  remove() {
    this.element.remove();
    NotificationMessage.instObj = undefined;
  }

  destroy() {
    //this.element.removeEventListener('animationend', () => this.remove());
    clearTimeout(this.timeOutID);
    this.remove();
  }
}