import { searchCompanies, getQuotes } from "./api.js";

export class SearchForm {
  constructor(element) {
    this.element = element;
    this.callback = null;
    this.render();
  }

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

  onSearch(callback) {
    this.callback = callback;
  }

  runSearch() {
    const query = this.input.value.trim();

    // Empty field: clear results and bail out
    if (!query) {
      this.status.innerHTML = "";
      if (this.callback) this.callback([], query);
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
          if (this.callback) this.callback([], query);
          return;
        }

        // Attach each symbol's change percentage to its company
        const changes = {};
        quotes.forEach((quote) => {
          changes[quote.symbol] = quote.changesPercentage;
        });

        const enriched = foundCompanies.map((company) => ({
          ...company,
          changesPercentage: changes[company.symbol]
        }));

        // Pass the query too, so results can highlight the match
        if (this.callback) this.callback(enriched, query);
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