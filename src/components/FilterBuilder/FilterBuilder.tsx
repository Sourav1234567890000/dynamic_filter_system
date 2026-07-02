import { useState } from "react";
import { Select, MenuItem, TextField, Button, Box } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import { userFilterConfig } from "../../config/userFilterConfig";
import type { ActiveFilter } from "../../types/filter.types";

interface FilterBuilderProps {
  onAddFilter: (filter: ActiveFilter) => void;
}

const operatorsByType: Record<string, string[]> = {
  text: ["equals", "contains", "startsWith", "endsWith", "doesNotContain"],
  number: ["equals", "greaterThan", "lessThan", "greaterThanOrEqual", "lessThanOrEqual"],
  date: ["between"],
  select: ["is", "isNot"],
  multiselect: ["in", "notIn"],
  boolean: ["is"],
};

export function FilterBuilder({ onAddFilter }: FilterBuilderProps) {
  const [selectedKey, setSelectedKey] = useState(userFilterConfig[0].key);
  const selectedField = userFilterConfig.find((field) => field.key === selectedKey);

  const availableOperators = selectedField ? operatorsByType[selectedField.type] : [];
  const [operator, setOperator] = useState(availableOperators[0] ?? "equals");
  const [value, setValue] = useState<string>("");
  const [multiValue, setMultiValue] = useState<string[]>([]);
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [error, setError] = useState<string>("");

  if (!selectedField) return null;

  const handleFieldChange = (e: SelectChangeEvent) => {
    const key = e.target.value;
    setSelectedKey(key);
    const field = userFilterConfig.find((f) => f.key === key);
    const ops = field ? operatorsByType[field.type] : [];
    setOperator(ops[0] ?? "equals");
    setValue("");
    setMultiValue([]);
    setDateFrom("");
    setDateTo("");
    setError("");
  };

  const handleAdd = () => {
    setError("");

    // Date range needs both ends filled
    if (selectedField.type === "date") {
      if (!dateFrom || !dateTo) {
        setError("Please select both a start and end date.");
        return;
      }
      if (new Date(dateFrom) > new Date(dateTo)) {
        setError("Start date must be before end date.");
        return;
      }
      onAddFilter({
        id: crypto.randomUUID(),
        key: selectedField.key,
        operator,
        value: [dateFrom, dateTo] as unknown as ActiveFilter["value"],
      });
      setDateFrom("");
      setDateTo("");
      return;
    }

    // Multiselect needs at least one option chosen
    if (selectedField.type === "multiselect") {
      if (multiValue.length === 0) {
        setError("Please select at least one option.");
        return;
      }
      onAddFilter({
        id: crypto.randomUUID(),
        key: selectedField.key,
        operator,
        value: multiValue,
      });
      setMultiValue([]);
      return;
    }

    // Everything else — single value
    if (value === "") {
      setError("Please enter a value.");
      return;
    }

    let parsedValue: ActiveFilter["value"] = value;
    if (selectedField.type === "number") {
      const num = Number(value);
      if (Number.isNaN(num)) {
        setError("Please enter a valid number.");
        return;
      }
      parsedValue = num;
    }
    if (selectedField.type === "boolean") parsedValue = value === "true";

    onAddFilter({
      id: crypto.randomUUID(),
      key: selectedField.key,
      operator,
      value: parsedValue,
    });
    setValue("");
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "row", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
      {/* Field picker — built from config, not hardcoded */}
      <Select size="small" value={selectedKey} onChange={handleFieldChange} sx={{ minWidth: 160 }}>
        {userFilterConfig.map((field) => (
          <MenuItem key={field.key} value={field.key}>
            {field.label}
          </MenuItem>
        ))}
      </Select>

      {/* Operator picker — changes based on selected field's type */}
      <Select
        size="small"
        value={operator}
        onChange={(e: SelectChangeEvent) => setOperator(e.target.value)}
        sx={{ minWidth: 160 }}
      >
        {availableOperators.map((op) => (
          <MenuItem key={op} value={op}>
            {op}
          </MenuItem>
        ))}
      </Select>

      {/* Value input — renders differently based on field type */}
      {selectedField.type === "select" ? (
        <Select
          size="small"
          value={value}
          onChange={(e: SelectChangeEvent) => setValue(e.target.value)}
          displayEmpty
          sx={{ minWidth: 160 }}
        >
          <MenuItem value="">
            <em>Select...</em>
          </MenuItem>
          {selectedField.options.map((opt) => (
            <MenuItem key={opt} value={opt}>
              {opt}
            </MenuItem>
          ))}
        </Select>
      ) : selectedField.type === "multiselect" ? (
        <Select
          size="small"
          multiple
          value={multiValue as unknown as string}
          onChange={(e) => {
            const val = e.target.value as unknown as string[];
            setMultiValue(typeof val === "string" ? (val as string).split(",") : val);
          }}
          displayEmpty
          renderValue={() => (multiValue.length ? multiValue.join(", ") : "Select...")}
          sx={{ minWidth: 200 }}
        >
          {selectedField.options.map((opt) => (
            <MenuItem key={opt} value={opt}>
              {opt}
            </MenuItem>
          ))}
        </Select>
      ) : selectedField.type === "date" ? (
        <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
          <TextField
            size="small"
            type="date"
            label="From"
            slotProps={{ inputLabel: { shrink: true } }}
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
          <TextField
            size="small"
            type="date"
            label="To"
            slotProps={{ inputLabel: { shrink: true } }}
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </Box>
      ) : selectedField.type === "boolean" ? (
        <Select
          size="small"
          value={value}
          onChange={(e: SelectChangeEvent) => setValue(e.target.value)}
          displayEmpty
          sx={{ minWidth: 160 }}
        >
          <MenuItem value="">
            <em>Select...</em>
          </MenuItem>
          <MenuItem value="true">True</MenuItem>
          <MenuItem value="false">False</MenuItem>
        </Select>
      ) : selectedField.type === "number" ? (
        <TextField
          size="small"
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      ) : (
        <TextField
          size="small"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      )}

      <Button variant="contained" onClick={handleAdd}>
        Add filter
      </Button>

      {error && (
        <span style={{ color: "#d32f2f", fontSize: 13 }}>{error}</span>
      )}
    </Box>
  );
}