import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Typography,
  Chip,
} from "@mui/material";

interface DataTableProps {
  data: Record<string, any>[];
  columns: string[];
  totalCount: number;
}

function getNestedValue(obj: any, path: string): any {
  return path.split(".").reduce((acc, part) => acc?.[part], obj);
}

function formatCell(value: any) {
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "boolean")
    return <Chip size="small" label={value ? "Yes" : "No"} color={value ? "success" : "default"} />;
  if (value === null || value === undefined) return "-";
  return String(value);
}

export function DataTable({ data, columns, totalCount }: DataTableProps) {
  return (
    <div>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Showing {data.length} of {totalCount} records
      </Typography>

      {data.length === 0 ? (
        <Typography sx={{ p: 3, textAlign: "center" }} color="text.secondary">
          No results
        </Typography>
      ) : (
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                {columns.map((col) => (
                  <TableCell key={col} sx={{ fontWeight: 600 }}>
                    {col}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.id} hover>
                  {columns.map((col) => (
                    <TableCell key={col}>{formatCell(getNestedValue(row, col))}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}