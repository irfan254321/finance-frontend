"use client";

import { useState, useMemo, useEffect } from "react";
import { TableRow, TableCell, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, MenuItem } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import axiosInstance from "@/lib/axiosInstance";
import CustomTextField from "@/components/ui/CustomTextField";
import TableLayout from "@/app/(Protected)/dashboard/edit/common/TableLayout"; // Sesuaikan path import

const rupiah = (n: any) => "Rp " + new Intl.NumberFormat("id-ID").format(Number(n || 0));

export default function IncomeTab({ baseProps, refreshTrigger }: { baseProps: any, refreshTrigger: any }) {
  const { setLoading, showAlert, handleError, setDeleteDialog } = baseProps;
  
  const [incomes, setIncomes] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  
  // Filter & Pagination
  const [query, setQuery] = useState("");
  const [dateQuery, setDateQuery] = useState("");
  const [page, setPage] = useState(1);

  // Edit State
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: "", amount: "", catId: "", date: "" });

  const fetchData = async () => {
    try {
      // Fetch Income & Kategori (untuk dropdown) secara paralel
      const [resInc, resCat] = await Promise.all([
        axiosInstance.get("/api/income"),
        axiosInstance.get("/api/categoryIncome")
      ]);
      setIncomes(resInc.data);
      setCategories(resCat.data);
    } catch (e) { handleError(e); }
  };

  useEffect(() => { 
    fetchData(); 
  }, [refreshTrigger]);

  // Logic Filtering Client-side
  const filtered = useMemo(() => incomes.filter(i =>
    `${i.name_income} ${i.category_id}`.toLowerCase().includes(query.toLowerCase()) &&
    (dateQuery ? i.date_income.includes(dateQuery) : true)
  ), [incomes, query, dateQuery]);

  const paged = useMemo(() => filtered.slice((page - 1) * 10, page * 10), [filtered, page]);

  const handleEdit = (i: any) => {
    setEditing(i);
    setForm({
      name: i.name_income,
      amount: String(i.amount_income || ""),
      catId: String(i.category_id),
      date: i.date_income,
    });
  };

  const handleSave = async () => {
    if (!editing) return;
    try {
      setLoading(true);
      await axiosInstance.put(`/api/detailIncome/${editing.id}`, {
        name_income: form.name,
        amount_income: Number(form.amount || 0),
        category_id: Number(form.catId),
        date_income: form.date,
      });
      showAlert("✅ Income berhasil diupdate");
      setEditing(null);
      fetchData();
    } catch (e) { handleError(e); } finally { setLoading(false); }
  };

  return (
    <>
      <TableLayout
        headers={["ID", "Nama", "Jumlah", "Kategori", "Tanggal", "Aksi"]}
        loading={false}
        onRefresh={fetchData}
        page={page} pageCount={Math.max(1, Math.ceil(filtered.length / 10))} onPageChange={setPage}
        searchQuery={query} onSearchChange={setQuery} searchPlaceholder="Cari income..."
        extraFilters={
           <CustomTextField type="date" size="small" value={dateQuery} onChange={(e: any) => setDateQuery(e.target.value)} sx={{ width: 200 }} />
        }
      >
        {paged.map(i => (
          <TableRow key={i.id} hover sx={{ "& td": { color: "#ECECEC" } }}>
            <TableCell>{i.id}</TableCell>
            <TableCell>{i.name_income}</TableCell>
            <TableCell>{rupiah(i.amount_income)}</TableCell>
            <TableCell>{i.category_id}</TableCell>
            <TableCell>{new Date(i.date_income).toLocaleDateString("id-ID", { day: "2-digit", month: "2-digit", year: "numeric" })}</TableCell>
            <TableCell>
              <IconButton size="small" onClick={() => handleEdit(i)} sx={{ color: "#FFE55C" }}><Edit fontSize="small" /></IconButton>
              <IconButton size="small" onClick={() => setDeleteDialog({ open: true, id: i.id, type: "income" })} sx={{ color: "#ff6363" }}><Delete fontSize="small" /></IconButton>
            </TableCell>
          </TableRow>
        ))}
        {paged.length === 0 && <TableRow><TableCell colSpan={6} sx={{ color: "#ECECEC" }}>Tidak ada data</TableCell></TableRow>}
      </TableLayout>

      {/* DIALOG EDIT */}
      <Dialog open={!!editing} onClose={() => setEditing(null)} maxWidth="sm" fullWidth PaperProps={{ sx: { background: "rgba(18,23,29,0.95)", border: "1px solid rgba(255,215,0,0.35)", color: "#ECECEC", borderRadius: "20px", p: 3, boxShadow: "0 0 40px rgba(255,215,0,0.15)" } }}>
        <DialogTitle sx={{ fontSize: "1.8rem", fontWeight: 700, textAlign: "center", color: "#FFD700", mb: 2 }}>Edit Income</DialogTitle>
        <DialogContent className="flex flex-col gap-4">
          <CustomTextField label="Nama Income" fullWidth value={form.name} onChange={(e: any) => setForm({ ...form, name: e.target.value })} />
          <CustomTextField label="Jumlah (Rp)" fullWidth value={new Intl.NumberFormat("id-ID").format(Number(form.amount || 0))} onChange={(e: any) => setForm({ ...form, amount: String(e.target.value).replace(/[^0-9]/g, "") })} />
          <CustomTextField select label="Kategori" fullWidth value={form.catId} onChange={(e: any) => setForm({ ...form, catId: e.target.value })}>
            {categories.map(c => <MenuItem key={c.id} value={String(c.id)}>{c.name_category}</MenuItem>)}
          </CustomTextField>
          <CustomTextField type="date" label="Tanggal" fullWidth InputLabelProps={{ shrink: true }} value={form.date} onChange={(e: any) => setForm({ ...form, date: e.target.value })} />
        </DialogContent>
        <DialogActions sx={{ justifyContent: "space-between", mt: 2 }}>
          <Button onClick={() => setEditing(null)} sx={{ color: "#ECECEC", fontWeight: 600 }}>BATAL</Button>
          <Button onClick={handleSave} variant="contained" sx={{ bgcolor: "#FFD700", color: "#12171d", fontWeight: 700, px: 4, "&:hover": { bgcolor: "#FFE55C" } }}>SIMPAN</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}