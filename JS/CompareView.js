import { getCompanyProfile } from "./api.js";

export class CompareView {
  constructor(element, symbols) {
    this.element = element;
    this.symbols = symbols;
  }

  // Fetch every selected company's profile, then lay them out side by side
  load() {
    if (!this.symbols || this.symbols.length === 0) {
      this.element.innerHTML = `<p class="status">No companies selected for comparison.</p>`;
      return Promise.resolve();
    }

    this.element.innerHTML = `<div class="status"><div class="spinner"></div></div>`;

    const requests = this.symbols.map((symbol) =>
      getCompanyProfile(symbol).then((data) => ({ symbol, profile: data.profile }))
    );

    return Promise.all(requests)
      .then((companies) => {
        this.render(companies);
      })
      .catch(() => {
        this.element.innerHTML = `<p class="status">Could not load comparison data.</p>`;
      });
  }

  render(companies) {
    const grid = document.createElement("div");
    grid.className = "compare-grid";

    companies.forEach(({ symbol, profile }) => {
      grid.appendChild(this.buildCard(symbol, profile));
    });

    this.element.innerHTML = "";
    this.element.appendChild(grid);
  }

  buildCard(symbol, profile) {
    // changesPercentage can arrive as "(+1.58%)" - clean it to a number
    const value = parseFloat(String(profile.changesPercentage).replace(/[()%]/g, ""));
    const direction = value >= 0 ? "up" : "down";
    const sign = value >= 0 ? "+" : "";

    const card = document.createElement("div");
    card.className = "compare-card";
    card.innerHTML = `
      <img class="compare-logo" src="${profile.image}" alt="${profile.companyName}">
      <h2 class="compare-name">${profile.companyName}</h2>
      <p class="compare-symbol">${symbol}</p>

      <dl class="compare-stats">
        <dt>Price</dt>
        <dd>$${profile.price}</dd>

        <dt>Change</dt>
        <dd class="change ${direction}">${sign}${value}%</dd>

        <dt>Sector</dt>
        <dd>${profile.sector || "-"}</dd>

        <dt>Industry</dt>
        <dd>${profile.industry || "-"}</dd>
      </dl>

      <a class="website" href="${profile.website}" target="_blank" rel="noopener">Visit website</a>
    `;
    return card;
  }
}
