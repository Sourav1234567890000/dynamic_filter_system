import { useState, useMemo } from "react";
import { Container, Typography, Box, Chip, CssBaseline } from "@mui/material";
import { FilterBuilder } from "./components/FilterBuilder/FilterBuilder";
import { DataTable } from "./components/DataTable/DataTable";
import { applyFilters } from "./utils/filterEngine";
import type { ActiveFilter } from "./types/filter.types";
import mockUsers from "./data/mockUsers.json";

const columns = [
  "name",
  "department",
  "role",
  "salary",
  "skills",
  "email",
  "address.city",
  "isActive",
];

export default function App() {
  const [filters, setFilters] = useState<ActiveFilter[]>([]);

  const filteredData = useMemo(
    () => applyFilters(mockUsers, filters),
    [filters],
  );

  const addFilter = (filter: ActiveFilter) => {
    setFilters((prev) => [...prev, filter]);
  };

  const removeFilter = (id: string) => {
    setFilters((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Dynamic Filter System
        </Typography>

        <FilterBuilder onAddFilter={addFilter} />

        {/* Active filter chips */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 1,
            flexWrap: "wrap",
            my: 2,
          }}
        >
          {filters.map((f) => (
            <Chip
              key={f.id}
              label={`${f.key} ${f.operator} ${String(f.value)}`}
              onDelete={() => removeFilter(f.id)}
              size="small"
            />
          ))}
        </Box>

        <DataTable
          data={filteredData}
          columns={columns}
          totalCount={mockUsers.length}
        />
      </Container>
    </>
  );
}
