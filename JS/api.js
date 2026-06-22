const API_KEY = "YOUR_API_KEY_HERE";
const BASE_URL = "https://financialmodelingprep.com/api/v3";

// Switch to false only when you want to test against the real API
const USE_MOCK = true;

const MOCK_SEARCH = [
  { name: "AAON, Inc.", symbol: "AAON" },
  { name: "Apple Inc.", symbol: "AAPL" },
  { name: "Axon Enterprise, Inc.", symbol: "AAXN" },
  { name: "Atlas Air Worldwide Holdings, Inc.", symbol: "AAWW" },
  { name: "American Airlines Group Inc.", symbol: "AAL" },
  { name: "Applied Optoelectronics, Inc.", symbol: "AAOI" },
  { name: "STAAR Surgical Company", symbol: "STAA" },
  { name: "Conyers Park II Acquisition Corp.", symbol: "CPAAW" },
  { name: "First Trust Alternative Absolute Return Strategy ETF", symbol: "FAAR" },
  { name: "Goldman Sachs Physical Gold ETF", symbol: "AAAU" }
];

function searchCompanies(query) {
  if (USE_MOCK) {
    // Fake a small delay so the loading spinner is actually visible
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_SEARCH), 500);
    });
  }

  const url = `${BASE_URL}/search?query=${encodeURIComponent(query)}&limit=10&exchange=NASDAQ&apikey=${API_KEY}`;
  return fetch(url).then((res) => res.json());
}