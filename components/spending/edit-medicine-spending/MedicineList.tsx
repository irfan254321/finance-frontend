/**
 * @component MedicineList
 * @description Component for displaying the list of medicines.
 */

"use client";

import { TableRow, TableCell, IconButton, Button } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import CustomTextField from "@/components/ui/CustomTextField";
import TableLayout from "@/app/(Protected)/dashboard/edit/common/TableLayout";

interface MedicineListProps {
  data: any[];
  loading: boolean;
  page: number;
  setPage: (page: number) => void;
  pageCount: number;
  searchId: string;
  setSearchId: (id: string) => void;
  onSearch: () => void;
  onRefresh: () => void;
  onEdit: (item: any) => void;
  onDelete: (id: number) => void;
}

const rupiah = (n: any) =>
  "Rp " + new Intl.NumberFormat("id-ID").format(Number(n || 0));

export default function MedicineList({
  data,
  loading,
  page,
  setPage,
  pageCount,
  searchId,
  setSearchId,
  onSearch,
  onRefresh,
  onEdit,
  onDelete,
}: MedicineListProps) {
  return (
    <TableLayout
      headers={[
        "ID",
        "Spending ID",
        "Nama Obat",
        "Qty",
        "Unit",
        "Harga per Item (Rp)",
        "Aksi",
      ]}
      loading={loading}
      onRefresh={onRefresh}
      page={page}
      pageCount={pageCount}
      onPageChange={setPage}
      searchQuery={undefined}
      onSearchChange={undefined}
      extraFilters={
        <div className="flex gap-2 w-full">
          <CustomTextField
            fullWidth
            label="Cari berdasarkan Spending ID"
            value={searchId}
            onChange={(e: any) =>
              setSearchId(e.target.value.replace(/[^0-9]/g, ""))
            }
          />
          <Button
            variant="contained"
            onClick={onSearch}
            sx={{
              bgcolor: "#FFD700",
              color: "#12171d",
              fontWeight: 700,
              "&:hover": { bgcolor: "#FFE55C" },
            }}
          >
            Cari
          </Button>
        </div>
      }
    >
      {data.map((m) => (
        <TableRow key={m.id} hover sx={{ "& td": { color: "#ECECEC" } }}>
          <TableCell>{m.id}</TableCell>
          <TableCell>{m.detail_spending_id}</TableCell>
          <TableCell>{m.name_medicine}</TableCell>
          <TableCell>{m.quantity}</TableCell>
          <TableCell>{m.name_unit ?? m.name_unit_id}</TableCell>
          <TableCell>{rupiah(m.price_per_item)}</TableCell>
          <TableCell>
            <IconButton
              size="small"
              onClick={() => onEdit(m)}
              sx={{ color: "#FFE55C" }}
            >
              <Edit fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => onDelete(m.id)}
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
            Tidak ada data (Cari ID terlebih dahulu)
          </TableCell>
        </TableRow>
      )}
    </TableLayout>
  );
}
