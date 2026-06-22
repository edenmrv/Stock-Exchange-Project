function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

const input = document.getElementById("searchInput");
const button = document.getElementById("searchBtn");
const status = document.getElementById("status");
const results = document.getElementById("results");

const debouncedSearch = debounce(runSearch, 400);

button.addEventListener("click", runSearch);
input.addEventListener("input", debouncedSearch);

function runSearch() {
  const query = input.value.trim();

  // Empty field: clear everything instead of searching for nothing
  if (!query) {
    results.innerHTML = "";
    status.innerHTML = "";
    return;
  }

  results.innerHTML = "";
  status.innerHTML = `<div class="spinner"></div>`;

  let foundCompanies = [];

  searchCompanies(query)
    .then((companies) => {
      foundCompanies = companies ? companies.slice(0, 10) : [];

      if (foundCompanies.length === 0) {
        return [];
      }

      const symbols = foundCompanies.map((company) => company.symbol);
      return getQuotes(symbols);
    })
    .then((quotes) => {
      status.innerHTML = "";

      if (foundCompanies.length === 0) {
        status.textContent = "No results found";
        return;
      }

      // Build a quick lookup: symbol -> change percentage
      const changes = {};
      quotes.forEach((quote) => {
        changes[quote.symbol] = quote.changesPercentage;
      });

      renderResults(foundCompanies, changes);
    })
    .catch(() => {
      status.textContent = "Something went wrong. Try again.";
    });
}

function renderResults(companies, changes) {
  companies.forEach((company) => {
    const li = document.createElement("li");

    const link = document.createElement("a");
    link.href = `company.html?symbol=${company.symbol}`;

    const logo = document.createElement("img");
    logo.className = "result-logo";
    logo.src = `https://financialmodelingprep.com/image-stock/${company.symbol}.png`;
    logo.alt = company.name;
    // Some companies have no logo on file - hide the broken image
    logo.onerror = () => { logo.style.visibility = "hidden"; };

    const name = document.createElement("span");
    name.className = "result-name";
    name.textContent = company.name;

    const symbol = document.createElement("span");
    symbol.className = "symbol";
    symbol.textContent = ` (${company.symbol})`;

    const change = document.createElement("span");
    const value = parseFloat(changes[company.symbol]);
    if (!isNaN(value)) {
      const sign = value >= 0 ? "+" : "";
      change.className = value >= 0 ? "change up" : "change down";
      change.textContent = ` (${sign}${value.toFixed(2)}%)`;
    }

    link.append(logo, name, symbol, change);
    li.appendChild(link);
    results.appendChild(li);
  });
}