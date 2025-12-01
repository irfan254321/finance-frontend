/**
 * @component SpendingList
 * @description Component for displaying the list of spendings.
 */

"use client";

import { TableRow, TableCell, IconButton } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import CustomTextField from "@/components/ui/CustomTextField";
import TableLayout from "@/app/(Protected)/dashboard/edit/common/TableLayout";

interface SpendingListProps {
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

export default function SpendingList({
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
}: SpendingListProps) {
  return (
    <TableLayout
      headers={[
        "ID",
        "Nama",
        "Jumlah",
        "Kategori",
        "Company",
        "Tanggal",
        "Aksi",
      ]}
      loading={loading}
      onRefresh={onRefresh}
      page={page}
      pageCount={pageCount}
      onPageChange={setPage}
      searchQuery={query}
      onSearchChange={setQuery}
      searchPlaceholder="Cari spending..."
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
      {data.map((s) => (
        <TableRow key={s.id} hover sx={{ "& td": { color: "#ECECEC" } }}>
          <TableCell>{s.id}</TableCell>
          <TableCell>{s.name_spending}</TableCell>
          <TableCell>{rupiah(s.amount_spending)}</TableCell>
          <TableCell>{s.category_id}</TableCell>
          <TableCell>{s.company_id ?? "-"}</TableCell>
          <TableCell>
            {new Date(s.date_spending).toLocaleDateString("id-ID")}
          </TableCell>
          <TableCell>
            <IconButton
              size="small"
              onClick={() => onEdit(s)}
              sx={{ color: "#FFE55C" }}
            >
              <Edit fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => onDelete(s.id)}
              sx={{ color: "#ff6363" }}
            >
              <Delete fontSize="small" />
            </IconButton>
          </TableCell>
        </TableRow>
      ))}
      {data.length === 0 && (
        <TableRow>
          <TableCell colSpan={7} sx={{ color: "#ECECEC" }}>
            Tidak ada data
          </TableCell>
        </TableRow>
      )}
    </TableLayout>
  );
}
