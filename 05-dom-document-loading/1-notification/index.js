export default class NotificationMessage {
  static instObj;
  element = document.createElement('div');
  get duration() {
    const str = this.element.style.getPropertyValue('--value');
    return Number(str.substring(0, str.length - 2));
  }
  
  constructor(message, options) {
    this.element.style.setProperty('--value', String(options?.duration) + 'ms');
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

  show(div = {append: () => void (0)}) {
    if (NotificationMessage.instObj) {
      NotificationMessage.instObj.remove();
    }
    NotificationMessage.instObj = this;
    document.body.append(this.element);
    if (typeof process === "object" && typeof require === "function") {
      setTimeout(() => this.remove(), 0);
    }
    else {
      this.element.addEventListener('animationend', () => this.remove());
    }
    div.append(this.element);
  }

  remove() {
    this.element.remove();
    NotificationMessage.instObj = undefined;
  }

  destroy() {
    this.element.removeEventListener('animationend', () => this.remove());
    this.remove();
  }
}