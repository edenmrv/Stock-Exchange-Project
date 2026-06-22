import { getTicker } from "./api.js";

export class Marquee {
  constructor(element) {
    this.element = element;
    this.track = null;
  }

  // Public entry point
  load() {
    return getTicker()
      .then((quotes) => {
        if (!quotes || quotes.length === 0) return;
        this.render(quotes);
      })
      .catch(() => {
        // Ticker is decorative 
      });
  }

  render(quotes) {
    this.track = document.createElement("div");
    this.track.className = "ticker-track";

    // Build the row once, then duplicate it for a seamless loop
    const itemsHtml = quotes.map((quote) => this.buildItem(quote)).join("");
    this.track.innerHTML = itemsHtml + itemsHtml;

    // Longer list -> slower scroll, so the speed feels consistent
    const duration = quotes.length * 4;
    this.track.style.animation = `scroll-left ${duration}s linear infinite`;

    this.element.classList.add("ticker");
    this.element.innerHTML = "";
    this.element.appendChild(this.track);
  }

  buildItem(quote) {
    const value = parseFloat(quote.changesPercentage);
    const direction = value >= 0 ? "up" : "down";
    const sign = value >= 0 ? "+" : "";
    const arrow = value >= 0 ? "▲" : "▼";

    return `
      <span class="ticker-item">
        <span class="ticker-symbol">${quote.symbol}</span>
        <span class="ticker-price">$${Number(quote.price).toFixed(2)}</span>
        <span class="ticker-change ${direction}">${arrow} ${sign}${value.toFixed(2)}%</span>
      </span>
    `;
  }
}