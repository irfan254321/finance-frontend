import { ReactNode } from "react";
import { Paper, Table, TableHead, TableRow, TableCell, TableBody, Pagination, IconButton, Tooltip } from "@mui/material";
import { Refresh, Search } from "@mui/icons-material";
import CustomTextField from "@/components/ui/CustomTextField";

interface TableLayoutProps {
  children: ReactNode; // Table Body Content
  headers: string[];
  page: number;
  pageCount: number;
  onPageChange: (v: number) => void;
  onRefresh: () => void;
  loading: boolean;
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
  searchPlaceholder?: string;
  extraFilters?: ReactNode; // Untuk DatePicker atau Custom Actions
}

export default function TableLayout({
  children, headers, page, pageCount, onPageChange, onRefresh, loading,
  searchQuery, onSearchChange, searchPlaceholder, extraFilters
}: TableLayoutProps) {
  return (
    <section className="mt-5">
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between mb-3">
        <div className="flex items-center gap-2 w-full md:w-2/3">
          {onSearchChange && (
            <>
              <Search fontSize="small" />
              <CustomTextField
                fullWidth size="small"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e: any) => onSearchChange(e.target.value)}
              />
            </>
          )}
          {extraFilters}
        </div>
        <Tooltip title="Refresh">
          <span><IconButton onClick={onRefresh} disabled={loading} sx={{ color: "#FFD700" }}><Refresh /></IconButton></span>
        </Tooltip>
      </div>

      <Paper sx={{ background: "transparent", borderRadius: "16px", border: "1px solid rgba(255,215,0,0.2)" }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {headers.map(h => (
                <TableCell key={h} sx={{ fontWeight: "bold", background: "#FFD700", color: "#12171d" }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {children}
          </TableBody>
        </Table>
      </Paper>

      <div className="flex justify-center mt-3">
        <Pagination
          count={pageCount} page={page} onChange={(_, v) => onPageChange(v)}
          sx={{ "& .MuiPaginationItem-root": { color: "#ECECEC" }, "& .Mui-selected": { bgcolor: "#FFD700", color: "#12171d" } }}
        />
      </div>
    </section>
  );
}