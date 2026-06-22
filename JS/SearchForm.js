import { searchCompanies, getQuotes } from "./api.js";

export class SearchForm {
  constructor(element) {
    this.element = element;
    this.callback = null;
    this.render();
  }

  // Build the input + button inside the host element
  render() {
    this.element.innerHTML = `
      <div class="search-bar">
        <input type="text" id="searchInput" placeholder="Search company...">
        <button id="searchBtn">Search</button>
      </div>
      <div id="status" class="status"></div>
    `;

    this.input = this.element.querySelector("#searchInput");
    this.button = this.element.querySelector("#searchBtn");
    this.status = this.element.querySelector("#status");

    const debouncedSearch = debounce(() => this.runSearch(), 400);

    this.button.addEventListener("click", () => this.runSearch());
    this.input.addEventListener("input", debouncedSearch);
  }

  // Register the callback that receives the found companies
  onSearch(callback) {
    this.callback = callback;
  }

  runSearch() {
    const query = this.input.value.trim();

    if (!query) {
      this.status.innerHTML = "";
      if (this.callback) this.callback([]);
      return;
    }

    this.status.innerHTML = `<div class="spinner"></div>`;

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
        this.status.innerHTML = "";

        if (foundCompanies.length === 0) {
          this.status.textContent = "No results found";
          if (this.callback) this.callback([]);
          return;
        }

        // Merge the change percentage into each company object
        const changes = {};
        quotes.forEach((quote) => {
          changes[quote.symbol] = quote.changesPercentage;
        });

        const enriched = foundCompanies.map((company) => ({
          ...company,
          changesPercentage: changes[company.symbol]
        }));

        if (this.callback) this.callback(enriched);
      })
      .catch(() => {
        this.status.textContent = "Something went wrong. Try again.";
      });
  }
}

function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}