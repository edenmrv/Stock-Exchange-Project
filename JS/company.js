const params = new URLSearchParams(window.location.search);
const symbol = params.get("symbol");

const status = document.getElementById("status");
const container = document.getElementById("company");

if (!symbol) {
  status.textContent = "No company symbol provided.";
} else {
  loadCompany(symbol);
}

function loadCompany(symbol) {
  status.innerHTML = `<div class="spinner"></div>`;

  Promise.all([getCompanyProfile(symbol), getStockHistory(symbol)])
    .then(([profileData, historyData]) => {
      status.innerHTML = "";
      renderProfile(profileData);
      renderChart(historyData);
      container.classList.remove("hidden");
    })
    .catch(() => {
      status.textContent = "Could not load company data. Try again.";
    });
}

function renderProfile(data) {
  const profile = data.profile;

  const logo = document.getElementById("logo");
  logo.src = profile.image;
  logo.alt = profile.companyName;

  document.getElementById("title").textContent =
    `${profile.companyName} (${profile.sector})`;

  document.getElementById("price").textContent = `$${profile.price}`;

  // strip the extra chars to a number
  const change = parseFloat(String(profile.changesPercentage).replace(/[()%]/g, ""));
  const changeEl = document.getElementById("change");
  const sign = change >= 0 ? "+" : "";

  changeEl.textContent = `(${sign}${change}%)`;
  changeEl.classList.add(change >= 0 ? "up" : "down");

  document.getElementById("description").textContent = profile.description;
  document.getElementById("website").href = profile.website;
}

function renderChart(data) {
  // API returns newest dates first
  const history = [...data.historical].reverse();

  const labels = history.map((point) => point.date);
  const prices = history.map((point) => point.close);

  const ctx = document.getElementById("priceChart");

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
}