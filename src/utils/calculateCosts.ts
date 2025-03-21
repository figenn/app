import { MONTHS_IN_YEAR, DISCOUNT_10, DISCOUNT_20, DISCOUNT_30 } from "./constants";

interface CostData {
  year: number;
  cost: number;
  cost10: number;
  cost20: number;
  cost30: number;
}

export function calculateCosts(price: number, years: number): CostData[] {
  return Array.from({ length: years + 1 }, (_, i) => ({
    year: i,
    cost: i * price * MONTHS_IN_YEAR,
    cost10: i * price * MONTHS_IN_YEAR * DISCOUNT_10,
    cost20: i * price * MONTHS_IN_YEAR * DISCOUNT_20,
    cost30: i * price * MONTHS_IN_YEAR * DISCOUNT_30,
  }));
}