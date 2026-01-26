export const currencyFormat = (value: number, currency?: string): string =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currency || "USD",
  }).format(value);
