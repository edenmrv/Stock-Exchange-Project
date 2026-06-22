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