const API_KEY = "YOUR_API_KEY_HERE";
const BASE_URL = "https://financialmodelingprep.com/api/v3";

// Switch to false only when you want to test against the real API
const USE_MOCK = true;

// FMP allows up to ~50 symbols per batch request.
const MAX_SYMBOLS_PER_REQUEST = 50;

const MOCK_SEARCH = [
  { name: "Approach Resources Inc.", symbol: "AREX" },
  { name: "Apple Inc.", symbol: "AAPL" },
  { name: "Applied Optoelectronics Inc.", symbol: "AAOI" },
  { name: "Applied Materials Inc.", symbol: "AMAT" },
  { name: "G-III Apparel Group LTD.", symbol: "GIII" },
  { name: "AppFolio Inc.", symbol: "APPF" },
  { name: "NetApp Inc.", symbol: "NTAP" },
  { name: "Appian Corporation", symbol: "APPN" },
  { name: "Applied Therapeutics, Inc.", symbol: "APLT" },
  { name: "Digital Turbine Inc.", symbol: "APPS" }
];

const MOCK_QUOTES = [
  { symbol: "AREX", changesPercentage: -26.56 },
  { symbol: "AAPL", changesPercentage: 4.64 },
  { symbol: "AAOI", changesPercentage: -0.21 },
  { symbol: "AMAT", changesPercentage: 4.27 },
  { symbol: "GIII", changesPercentage: 3.27 },
  { symbol: "APPF", changesPercentage: 0.03 },
  { symbol: "NTAP", changesPercentage: 0.94 },
  { symbol: "APPN", changesPercentage: 8.47 },
  { symbol: "APLT", changesPercentage: 7.14 },
  { symbol: "APPS", changesPercentage: 18.49 }
];

const MOCK_PROFILE = {
  symbol: "AAON",
  profile: {
    price: "57.07",
    changes: "0.89",
    changesPercentage: "(+1.58%)",
    companyName: "AAON Inc.",
    exchange: "Nasdaq",
    industry: "HVAC Equipment",
    website: "https://www.aaon.com",
    description:
      "AAON Inc is a heating, ventilation and air conditioning equipment " +
      "manufacturer. Its products include rooftop units, chillers, " +
      "air-handling units, make-up air units, heat recovery units, " +
      "condensing units and coils.",
    sector: "Basic Materials",
    image: "https://financialmodelingprep.com/image-stock/AAON.png"
  }
};

// The real API returns history newest-first, so the mock mirrors that
const MOCK_HISTORY = {
  symbol: "AAON",
  historical: [
    { date: "2020-03-03", close: 56.0 },
    { date: "2018-09-18", close: 40.0 },
    { date: "2017-04-06", close: 34.5 },
    { date: "2015-10-23", close: 21.5 },
    { date: "2014-05-14", close: 20.5 },
    { date: "2012-11-29", close: 9.5 },
    { date: "2011-06-17", close: 10.2 },
    { date: "2010-01-06", close: 5.5 },
    { date: "2008-07-25", close: 6.0 },
    { date: "2007-02-13", close: 5.8 },
    { date: "2005-08-30", close: 3.5 },
    { date: "2004-03-19", close: 3.8 },
    { date: "2002-10-07", close: 2.5 },
    { date: "2001-04-20", close: 2.0 },
    { date: "1999-11-08", close: 1.3 },
    { date: "1998-05-29", close: 1.0 },
    { date: "1996-12-16", close: 0.7 },
    { date: "1995-07-10", close: 0.6 },
    { date: "1994-01-26", close: 0.5 }
  ]
};
const MOCK_TICKER = [
  { symbol: "AAPL", price: 257.13, changesPercentage: 4.64 },
  { symbol: "AMAT", price: 188.42, changesPercentage: 4.27 },
  { symbol: "NTAP", price: 121.05, changesPercentage: 0.94 },
  { symbol: "APPN", price: 63.88, changesPercentage: 8.47 },
  { symbol: "GIII", price: 28.91, changesPercentage: 3.27 },
  { symbol: "AAOI", price: 41.37, changesPercentage: -0.21 },
  { symbol: "APPF", price: 214.6, changesPercentage: 0.03 },
  { symbol: "APLT", price: 9.12, changesPercentage: 7.14 },
  { symbol: "APPS", price: 5.44, changesPercentage: 18.49 },
  { symbol: "AREX", price: 1.18, changesPercentage: -26.56 },
  { symbol: "MSFT", price: 511.7, changesPercentage: 1.12 },
  { symbol: "GOOG", price: 178.3, changesPercentage: -0.88 },
  { symbol: "AMZN", price: 224.95, changesPercentage: 2.05 },
  { symbol: "META", price: 612.4, changesPercentage: -1.34 },
  { symbol: "NVDA", price: 138.6, changesPercentage: 3.91 }
];

function getTicker() {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_TICKER), 300);
    });
  }

  // Returns all NASDAQ quotes
  const url = `${BASE_URL}/quotes/NASDAQ?apikey=${API_KEY}`;
  return fetch(url).then((res) => res.json());
}

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

function getQuotes(symbols) {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_QUOTES), 300);
    });
  }

  // Split the symbols into chunks and fire all chunks in parallel
  const chunks = chunkArray(symbols, MAX_SYMBOLS_PER_REQUEST);

  const requests = chunks.map((chunk) => {
    const list = chunk.join(",");
    const url = `${BASE_URL}/quote/${list}?apikey=${API_KEY}`;
    return fetch(url).then((res) => res.json());
  });

  // Each request resolves to an array; flatten them into one array
  return Promise.all(requests).then((responses) => responses.flat());
}

function chunkArray(items, size) {
  const chunks = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

function getCompanyProfile(symbol) {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_PROFILE), 500);
    });
  }

  const url = `${BASE_URL}/company/profile/${symbol}?apikey=${API_KEY}`;
  return fetch(url).then((res) => res.json());
}

function getStockHistory(symbol) {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_HISTORY), 500);
    });
  }

  const url = `${BASE_URL}/historical-price-full/${symbol}?serietype=line&apikey=${API_KEY}`;
  return fetch(url).then((res) => res.json());
}