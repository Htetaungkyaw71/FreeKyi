export const SORT_OPTIONS = [
  { value: "popularity.desc", label: "Most Popular" },
  { value: "vote_average.desc", label: "Top Rated" },
  { value: "release_date.desc", label: "Newest" },
  { value: "revenue.desc", label: "Box Office" },
];

export const COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "KR", name: "South Korea" },
  { code: "JP", name: "Japan" },
  { code: "GB", name: "United Kingdom" },
  { code: "FR", name: "France" },
  { code: "IN", name: "India" },
  { code: "ES", name: "Spain" },
  { code: "IT", name: "Italy" },
  { code: "DE", name: "Germany" },
  { code: "CN", name: "China" },
];

const CURRENT_YEAR = new Date().getFullYear();

export const YEARS = Array.from(
  { length: 30 },
  (_, index) => CURRENT_YEAR - index,
);
