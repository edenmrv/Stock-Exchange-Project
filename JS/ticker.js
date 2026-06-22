const track = document.getElementById("tickerTrack");

getTicker()
  .then((quotes) => {
    if (!quotes || quotes.length === 0) return;

    buildTicker(quotes);
  })
  .catch(() => {
    // Ticker is decorative
  });

function buildTicker(quotes) {
  // Build the row of items once
  const itemsHtml = quotes.map(buildItem).join("");

  // Duplicate it so the loop has no visible gap when it restarts
  track.innerHTML = itemsHtml + itemsHtml;

  // Longer list -> slower scroll, so speed feels consistent
  const duration = quotes.length * 4;
  track.style.animation = `scroll-left ${duration}s linear infinite`;
}

function buildItem(quote) {
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