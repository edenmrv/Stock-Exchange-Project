export class SearchResult {
  constructor(element) {
    this.element = element;
  }

  renderResults(companies) {
    this.element.innerHTML = "";

    if (!companies || companies.length === 0) {
      return;
    }

    const list = document.createElement("ul");
    list.className = "results";

    companies.forEach((company) => {
      list.appendChild(this.buildItem(company));
    });

    this.element.appendChild(list);
  }

  buildItem(company) {
    const li = document.createElement("li");

    const link = document.createElement("a");
    link.href = `company.html?symbol=${company.symbol}`;

    const logo = document.createElement("img");
    logo.className = "result-logo";
    logo.src = `https://financialmodelingprep.com/image-stock/${company.symbol}.png`;
    logo.alt = company.name;
    logo.onerror = () => { logo.style.visibility = "hidden"; };

    const name = document.createElement("span");
    name.className = "result-name";
    name.textContent = company.name;

    const symbol = document.createElement("span");
    symbol.className = "symbol";
    symbol.textContent = ` (${company.symbol})`;

    const change = document.createElement("span");
    const value = parseFloat(company.changesPercentage);
    if (!isNaN(value)) {
      const sign = value >= 0 ? "+" : "";
      change.className = value >= 0 ? "change up" : "change down";
      change.textContent = ` (${sign}${value.toFixed(2)}%)`;
    }

    link.append(logo, name, symbol, change);
    li.appendChild(link);
    return li;
  }
}