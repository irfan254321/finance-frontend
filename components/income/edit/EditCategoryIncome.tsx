import { useState, useMemo, useEffect } from "react";
import { TableRow, TableCell, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import axiosInstance from "@/lib/axiosInstance";
import CustomTextField from "@/components/ui/CustomTextField";
import TableLayout from "@/app/(Protected)/dashboard/edit/common/TableLayout";

export default function CategoryTab({ baseProps, refreshTrigger }: { baseProps: any, refreshTrigger: any }) {
  const { setLoading, showAlert, handleError, setDeleteDialog } = baseProps;
  const [categories, setCategories] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  
  // Edit State
  const [editing, setEditing] = useState<any>(null);
  const [editName, setEditName] = useState("");

  const fetchData = async () => {
    try {
      const res = await axiosInstance.get("/api/categoryIncome");
      setCategories(res.data);
    } catch (e) { handleError(e); }
  };

  useEffect(() => { 
    fetchData(); 
  }, [refreshTrigger]);

  const filtered = useMemo(() => categories.filter(c => c.name_category.toLowerCase().includes(query.toLowerCase())), [categories, query]);
  const paged = useMemo(() => filtered.slice((page - 1) * 10, page * 10), [filtered, page]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / 10));

  const handleSave = async () => {
    try {
      setLoading(true);
      await axiosInstance.put(`/api/categoryIncome/${editing.id}`, { name_category: editName });
      showAlert("✅ Kategori berhasil diupdate");
      setEditing(null);
      fetchData();
    } catch (e) { handleError(e); } finally { setLoading(false); }
  };

  return (
    <>
      <TableLayout
        headers={["ID", "Nama Kategori", "Aksi"]}
        loading={false}
        onRefresh={fetchData}
        page={page} pageCount={pageCount} onPageChange={setPage}
        searchQuery={query} onSearchChange={setQuery} searchPlaceholder="Cari kategori..."
      >
        {paged.map((c) => (
          <TableRow key={c.id} hover sx={{ "& td": { color: "#ECECEC" } }}>
            <TableCell>{c.id}</TableCell>
            <TableCell>{c.name_category}</TableCell>
            <TableCell>
              <IconButton size="small" onClick={() => { setEditing(c); setEditName(c.name_category); }} sx={{ color: "#FFE55C" }}><Edit fontSize="small" /></IconButton>
              <IconButton size="small" onClick={() => setDeleteDialog({ open: true, id: c.id, type: "category" })} sx={{ color: "#ff6363" }}><Delete fontSize="small" /></IconButton>
            </TableCell>
          </TableRow>
        ))}
        {paged.length === 0 && <TableRow><TableCell colSpan={3} sx={{ color: "#ECECEC" }}>Tidak ada data</TableCell></TableRow>}
      </TableLayout>

      {/* DIALOG EDIT */}
      <Dialog open={!!editing} onClose={() => setEditing(null)} PaperProps={{ sx: { background: "rgba(18,23,29,0.95)", border: "1px solid rgba(255,215,0,0.25)", color: "#ECECEC", borderRadius: "16px" } }}>
        <DialogTitle>Edit Kategori</DialogTitle>
        <DialogContent>
          <CustomTextField fullWidth label="Nama Kategori" value={editName} onChange={(e: any) => setEditName(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditing(null)} sx={{ color: "#ECECEC" }}>Batal</Button>
          <Button onClick={handleSave} variant="contained" sx={{ bgcolor: "#FFD700", color: "#12171d", fontWeight: 700 }}>Simpan</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}