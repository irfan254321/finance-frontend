/**
 * @component IncomeList
 * @description Component for displaying the list of incomes.
 */

"use client";

import { TableRow, TableCell, IconButton } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import CustomTextField from "@/components/ui/CustomTextField";
import TableLayout from "@/app/(Protected)/dashboard/edit/common/TableLayout";

interface IncomeListProps {
  data: any[];
  loading: boolean;
  page: number;
  setPage: (page: number) => void;
  pageCount: number;
  query: string;
  setQuery: (query: string) => void;
  dateQuery: string;
  setDateQuery: (date: string) => void;
  onRefresh: () => void;
  onEdit: (item: any) => void;
  onDelete: (id: number) => void;
}

const rupiah = (n: any) =>
  "Rp " + new Intl.NumberFormat("id-ID").format(Number(n || 0));

export default function IncomeList({
  data,
  loading,
  page,
  setPage,
  pageCount,
  query,
  setQuery,
  dateQuery,
  setDateQuery,
  onRefresh,
  onEdit,
  onDelete,
}: IncomeListProps) {
  return (
    <TableLayout
      headers={["ID", "Nama", "Jumlah", "Kategori", "Tanggal", "Aksi"]}
      loading={loading}
      onRefresh={onRefresh}
      page={page}
      pageCount={pageCount}
      onPageChange={setPage}
      searchQuery={query}
      onSearchChange={setQuery}
      searchPlaceholder="Cari income..."
      extraFilters={
        <CustomTextField
          type="date"
          size="small"
          value={dateQuery}
          onChange={(e: any) => setDateQuery(e.target.value)}
          sx={{ width: 200 }}
        />
      }
    >
      {data.map((i) => (
        <TableRow key={i.id} hover sx={{ "& td": { color: "#ECECEC" } }}>
          <TableCell>{i.id}</TableCell>
          <TableCell>{i.name_income}</TableCell>
          <TableCell>{rupiah(i.amount_income)}</TableCell>
          <TableCell>{i.category_id}</TableCell>
          <TableCell>
            {new Date(i.date_income).toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </TableCell>
          <TableCell>
            <IconButton
              size="small"
              onClick={() => onEdit(i)}
              sx={{ color: "#FFE55C" }}
            >
              <Edit fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => onDelete(i.id)}
              sx={{ color: "#ff6363" }}
            >
              <Delete fontSize="small" />
            </IconButton>
          </TableCell>
        </TableRow>
      ))}
      {data.length === 0 && (
        <TableRow>
          <TableCell colSpan={6} sx={{ color: "#ECECEC" }}>
            Tidak ada data
          </TableCell>
        </TableRow>
      )}
    </TableLayout>
  );
}
