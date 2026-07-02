import type { ActiveFilter } from "../types/filter.types";

// handles dot-notation like "address.city"
function getNestedValue(obj: any, path: string): any {
  return path.split(".").reduce((acc, part) => acc?.[part], obj);
}

function matchesFilter(record: any, filter: ActiveFilter): boolean {
  const value = getNestedValue(record, filter.key);
  const { operator, value: filterValue } = filter;
    
  switch (operator) {
    case "equals":
      return String(value).toLowerCase() === String(filterValue).toLowerCase();
    case "contains":
      return String(value).toLowerCase().includes(String(filterValue).toLowerCase());
    case "startsWith":
      return String(value).toLowerCase().startsWith(String(filterValue).toLowerCase());
    case "endsWith":
      return String(value).toLowerCase().endsWith(String(filterValue).toLowerCase());
    case "doesNotContain":
      return !String(value).toLowerCase().includes(String(filterValue).toLowerCase());

    case "greaterThan":
      return Number(value) > Number(filterValue);
    case "lessThan":
      return Number(value) < Number(filterValue);
    case "greaterThanOrEqual":
      return Number(value) >= Number(filterValue);
    case "lessThanOrEqual":
      return Number(value) <= Number(filterValue);

    case "is":
      return value === filterValue;
    case "isNot":
      return value !== filterValue;

    // value on the record is an array (e.g. skills: ["React","SQL"])
    // filterValue is the array of options the user picked in the multiselect
    // "in" = record has AT LEAST ONE of the selected options
    case "in": {
      if (!Array.isArray(value) || !Array.isArray(filterValue)) return false;
      return value.some((v) => filterValue.includes(v));
    }
    // "notIn" = record has NONE of the selected options
    case "notIn": {
      if (!Array.isArray(value) || !Array.isArray(filterValue)) return false;
      return !value.some((v) => filterValue.includes(v));
    }

    // date range: filterValue is [fromDateString, toDateString]
    case "between": {
      if (!Array.isArray(filterValue)) return false;
      const [from, to] = filterValue as unknown as [string, string];
      const recordDate = new Date(value).getTime();
      const fromTime = new Date(from).getTime();
      const toTime = new Date(to).getTime();
      if (Number.isNaN(recordDate)) return false;
      return recordDate >= fromTime && recordDate <= toTime;
    }

    default:
      return true;
  }
}

// Main export: applies ALL active filters (AND logic) to the dataset
export function applyFilters<T>(data: T[], filters: ActiveFilter[]): T[] {
  if (filters.length === 0) return data;
  return data.filter((record) => filters.every((f) => matchesFilter(record, f)));
}