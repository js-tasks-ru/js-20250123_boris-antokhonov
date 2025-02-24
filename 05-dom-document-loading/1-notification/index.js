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

  show(el = document.body) {
    if (NotificationMessage.instObj) {
      NotificationMessage.instObj.remove();
    }
    NotificationMessage.instObj = this;
    el.append(this.element);
    this.timeOutID = setTimeout(() => this.remove(), this.duration);    
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    clearTimeout(this.timeOutID);
    this.remove();
    NotificationMessage.instObj = undefined;
  }
}