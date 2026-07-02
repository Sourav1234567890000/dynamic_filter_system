# Dynamic Filter Component System

A reusable, config-driven filter system built with React 18, TypeScript, and MUI. The filter builder adapts its inputs and operators based on an external field configuration — no internal changes are needed to reuse it across different data tables.

## Tech Stack

- React 18 + TypeScript
- Vite
- Material UI (MUI)

## Getting Started

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

To build for production:

```bash
npm run build
```

## Project Structure

```
src/
├── types/
│   └── filter.types.ts       # FieldConfig (discriminated union), ActiveFilter
├── config/
│   └── userFilterConfig.ts   # Field definitions for the Users dataset
├── components/
│   ├── FilterBuilder/
│   │   └── FilterBuilder.tsx # Field + operator + value picker, config-driven
│   └── DataTable/
│       └── DataTable.tsx     # Renders filtered records, handles nested fields
├── utils/
│   └── filterEngine.ts       # Pure functions: matchesFilter, applyFilters
├── data/
│   └── mockUsers.json        # 50 sample records with nested objects and arrays
└── App.tsx                   # Wires filter state to the table
```

## How It Works

1. **Config drives everything.** `userFilterConfig.ts` defines each filterable field's `key`, `label`, and `type` (text, number, date, select, multiselect, or boolean). `FilterBuilder` reads this array to render the field dropdown — it never hardcodes a field name.

2. **Operators and inputs adapt to field type.** Selecting a field looks up its allowed operators (e.g. text → contains/equals/startsWith; number → greaterThan/lessThan) and swaps the value input accordingly (text box, number box, dropdown, multi-select, boolean toggle, or a From/To date range).

3. **Filtering is pure and framework-agnostic.** `filterEngine.ts` has no React code — it takes the dataset and an array of active filters and returns matching records. It supports:
   - Case-insensitive text matching (contains, startsWith, endsWith, equals, doesNotContain)
   - Numeric comparisons (equals, greaterThan, lessThan, and their orEqual variants)
   - Date range filtering (`between`, with real `Date` comparison)
   - Single-select (`is` / `isNot`)
   - Multi-select array overlap (`in` / `notIn`)
   - Dot-notation nested lookups (e.g. `address.city`)
   - AND logic across all active filters

4. **Table stays in sync.** `App.tsx` recomputes filtered results with `useMemo` whenever filters change, and displays a live count of filtered vs. total records, plus a "No results" state when nothing matches.

## Adding a New Field or Table

To reuse this system for a different dataset, add a new config file (e.g. `transactionFilterConfig.ts`) with the desired fields, and pass it into `FilterBuilder`. No changes to `FilterBuilder.tsx` or `filterEngine.ts` are required.

To add a new field type (e.g. a currency range), extend the `FieldConfig` discriminated union in `filter.types.ts`, add its operators to `operatorsByType`, and add a rendering branch in `FilterBuilder.tsx`.

## Validation

The filter builder validates before adding a filter: empty values, non-numeric input for number fields, incomplete date ranges, invalid date order, and empty multiselect selections are all caught with inline error messages.
