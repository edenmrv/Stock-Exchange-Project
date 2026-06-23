import { getCompanyProfile, getStockHistory } from "./api.js";

export class CompanyInfo {
  constructor(element, symbol) {
    this.element = element;
    this.symbol = symbol;
    this.profile = null;
  }

  // Fetch the profile and render the company details
  load() {
    if (!this.symbol) {
      this.element.innerHTML = `<p class="status">No company symbol provided.</p>`;
      return Promise.resolve();
    }

    this.element.innerHTML = `<div class="status"><div class="spinner"></div></div>`;

    return getCompanyProfile(this.symbol)
      .then((data) => {
        this.profile = data.profile;
        this.render();
      })
      .catch(() => {
        this.element.innerHTML = `<p class="status">Could not load company data.</p>`;
      });
  }

  render() {
    const profile = this.profile;

    // changesPercentage can arrive as "(+1.58%)" - clean it to a number
    const value = parseFloat(String(profile.changesPercentage).replace(/[()%]/g, ""));
    const direction = value >= 0 ? "up" : "down";
    const sign = value >= 0 ? "+" : "";

    this.element.innerHTML = `
      <a href="index.html" class="back-link">&larr; Back to search</a>

      <header class="company-header">
        <img class="logo" src="${profile.image}" alt="${profile.companyName}">
        <h1 class="company-title">${profile.companyName} (${profile.sector})</h1>
      </header>

      <p class="price">
        Stock price: <span>$${profile.price}</span>
        <span class="change ${direction}">(${sign}${value}%)</span>
      </p>

      <p class="description">${profile.description}</p>
      <a class="website" href="${profile.website}" target="_blank" rel="noopener">Visit website</a>

      <div class="chart-wrap">
        <canvas id="priceChart"></canvas>
      </div>
    `;
  }

  // Fetch the price history and draw it as a line chart
  addChart() {
    if (!this.symbol) {
      return Promise.resolve();
    }

    return getStockHistory(this.symbol)
      .then((data) => {
        // API returns newest dates first, so reverse for a left-to-right timeline
        const history = [...data.historical].reverse();

        const labels = history.map((point) => point.date);
        const prices = history.map((point) => point.close);

        const ctx = this.element.querySelector("#priceChart");

        new Chart(ctx, {
          type: "line",
          data: {
            labels: labels,
            datasets: [{
              label: "Stock Price History",
              data: prices,
              borderColor: "#ec4899",
              backgroundColor: "rgba(236, 72, 153, 0.35)",
              fill: true,
              pointRadius: 0,
              borderWidth: 2,
              tension: 0.25
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: { position: "top" }
            },
            scales: {
              x: { ticks: { maxTicksLimit: 20, autoSkip: true } },
              y: { beginAtZero: true }
            }
          }
        });
      })
      .catch(() => {
        // Chart is secondary - don't break the page if it fails
      });
  }
}