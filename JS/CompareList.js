export class CompareList {
  constructor(element, maxItems = 3) {
    this.element = element;
    this.maxItems = maxItems;
    this.storageKey = "compareList";
    // Persisted in localStorage so the list survives the jump to compare.html
    this.companies = this.loadFromStorage().slice(0, this.maxItems);
    this.render();
  }

  isFull() {
    return this.companies.length >= this.maxItems;
  }

  loadFromStorage() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  save() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.companies));
  }

  // Add a company unless it's already in the list or the list is full
  add(company) {
    if (this.has(company.symbol)) return false;
    if (this.isFull()) return false;
    this.companies.push({ symbol: company.symbol, name: company.name });
    this.save();
    this.render();
    return true;
  }

  remove(symbol) {
    this.companies = this.companies.filter((company) => company.symbol !== symbol);
    this.save();
    this.render();
  }

  has(symbol) {
    return this.companies.some((company) => company.symbol === symbol);
  }

  getAll() {
    return [...this.companies];
  }

  clear() {
    this.companies = [];
    this.save();
    this.render();
  }

  render() {
    // Nothing selected yet: keep the bar out of the way
    if (this.companies.length === 0) {
      this.element.classList.add("hidden");
      this.element.innerHTML = "";
      return;
    }

    this.element.classList.remove("hidden");
    this.element.innerHTML = "";

    const chips = document.createElement("div");
    chips.className = "compare-chips";

    this.companies.forEach((company) => {
      const chip = document.createElement("button");
      chip.className = "compare-chip";
      chip.title = `Remove ${company.symbol} from comparison`;
      chip.innerHTML = `
        <span class="chip-symbol">${company.symbol}</span>
        <span class="chip-x">&times;</span>
      `;
      chip.addEventListener("click", () => this.remove(company.symbol));
      chips.appendChild(chip);
    });

    const count = document.createElement("span");
    count.className = "compare-count";
    count.textContent = `${this.companies.length}/${this.maxItems}`;

    // Compare button at the right end -> new page with the chosen symbols
    const goBtn = document.createElement("a");
    goBtn.className = "compare-go";
    goBtn.textContent = "Compare";
    const symbols = this.companies.map((company) => company.symbol).join(",");
    goBtn.href = `compare.html?symbols=${encodeURIComponent(symbols)}`;

    this.element.append(chips, count, goBtn);
  }

  // Briefly highlight the bar to signal the limit was reached
  flashFull() {
    this.element.classList.remove("hidden");
    this.element.classList.add("is-full");
    setTimeout(() => this.element.classList.remove("is-full"), 500);
  }
}
