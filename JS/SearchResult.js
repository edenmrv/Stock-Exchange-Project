export class SearchResult {
  constructor(element) {
    this.element = element;
  }

  renderResults(companies, query) {
    this.element.innerHTML = "";

    if (!companies || companies.length === 0) {
      return;
    }

    const list = document.createElement("ul");
    list.className = "results";

    companies.forEach((company) => {
      list.appendChild(this.buildItem(company, query));
    });

    this.element.appendChild(list);
  }

  buildItem(company, query) {
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
    name.innerHTML = this.highlight(company.name, query);

    const symbol = document.createElement("span");
    symbol.className = "symbol";
    symbol.innerHTML = ` (${this.highlight(company.symbol, query)})`;

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

  // Wrap the matched part in <mark>, keeping the original letters
  highlight(text, query) {
    const safeText = this.escapeHtml(text);
    if (!query) return safeText;

    const regex = new RegExp(`(${this.escapeRegex(query)})`, "gi");
    return safeText.replace(regex, "<mark>$1</mark>");
  }

  // Stop raw API text from being parsed as HTML
  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  // Neutralize regex-special characters in the user's input
  escapeRegex(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
}