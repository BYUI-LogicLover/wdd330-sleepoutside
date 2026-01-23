export default class Alert {
  constructor() {
    this.alertsPath = '/json/alerts.json';
  }

  async init() {
    const alerts = await this.getAlerts();
    if (alerts && alerts.length > 0) {
      this.renderAlerts(alerts);
    }
  }

  async getAlerts() {
    const response = await fetch(this.alertsPath);
    if (response.ok) {
      return response.json();
    }
    return [];
  }

  renderAlerts(alerts) {
    try {
      const section = document.createElement('section');
      section.className = 'alert-list';

      alerts.forEach((alert) => {
        const p = document.createElement('p');
        p.textContent = alert.message;
        p.style.backgroundColor = alert.background;
        p.style.color = alert.color;
        section.appendChild(p);
      });

      const main = document.querySelector('main');

      // Check if main exists before trying to prepend to it
      if (main) {
        main.prepend(section);
      } else {
        throw new Error(
          'Could not find the <main> element on this page. Check your HTML!',
        );
      }
    } catch (error) {
      console.error('Alert Component Error:', error.message);
    }
  }
}
