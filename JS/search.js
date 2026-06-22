const input = document.getElementById("searchInput");
const button = document.getElementById("searchBtn");
const status = document.getElementById("status");
const results = document.getElementById("results");

button.addEventListener("click", runSearch);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") runSearch();
});

function runSearch() {
  const query = input.value.trim();
  if (!query) return;

  results.innerHTML = "";
  status.innerHTML = `<div class="spinner"></div>`;

  searchCompanies(query)
    .then((companies) => {
      status.innerHTML = "";

      if (!companies || companies.length === 0) {
        status.textContent = "No results found";
        return;
      }

      renderResults(companies);
    })
    .catch(() => {
      status.textContent = "Something went wrong. Try again.";
    });
}

function renderResults(companies) {
  companies.forEach((company) => {
    const li = document.createElement("li");
    const link = document.createElement("a");

    link.href = `company.html?symbol=${company.symbol}`;
    link.innerHTML = `${company.name} <span class="symbol">(${company.symbol})</span>`;

    li.appendChild(link);
    results.appendChild(li);
  });
}