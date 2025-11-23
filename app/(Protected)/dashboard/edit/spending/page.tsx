// app/dashboard/edit/spending/page.tsx (atau path kamu)
"use client";

import { useEffect, useMemo, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { motion } from "framer-motion";
import {
  Tabs,
  Tab,
  Box,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  IconButton,
  Snackbar,
  Alert,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import { Edit, Delete, Refresh, Search } from "@mui/icons-material";
import CustomTextField from "@/components/ui/CustomTextField";
import DeleteConfirmDialog from "@/components/ui/DeleteConfirmDialog";

// ===== Types =====
type Category = { id: number; name_category: string; created_at?: string };
type Company = { id: number; name_company: string; created_at?: string };
type UnitMed = { id: number; name_unit: string; created_at?: string };
type Spending = {
  id: number;
  name_spending: string;
  amount_spending: number;
  company_id: number | null;
  category_id: number;
  date_spending: string;
  created_at?: string;
};
type MedicineDetail = {
  id: number;
  detail_spending_id: number;
  name_medicine: string;
  quantity: number;
  name_unit_id: number;
  name_unit?: string;
  price_per_item: number;
  created_at?: string;
};



// ===== Utils =====
const rupiah = (n: number | null | undefined) =>
  "Rp " + new Intl.NumberFormat("id-ID").format(Number(n || 0));

export default function EditSpendingPage() {

    
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  // ===== Shared Lists =====
  const [categories, setCategories] = useState<Category[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [units, setUnits] = useState<UnitMed[]>([]);
  const [spendings, setSpendings] = useState<Spending[]>([]);
  const [medicines, setMedicines] = useState<MedicineDetail[]>([]);

  // ===== SEARCH states =====
  const [catQuery, setCatQuery] = useState("");
  const [companyQuery, setCompanyQuery] = useState("");
  const [unitQuery, setUnitQuery] = useState("");
  const [spendingQuery, setSpendingQuery] = useState("");
  const [dateQuery, setDateQuery] = useState(""); // <— New Date Search State
  const [medQuery, setMedQuery] = useState("");
  const [medSearchSpendingId, setMedSearchSpendingId] = useState("");

  

  // ===== Pagination (client-side) =====
  const pageSize = 10;

  // CATEGORY
  const [catPage, setCatPage] = useState(1);
  const filteredCategories = useMemo(
    () =>
      categories.filter((c) =>
        c.name_category.toLowerCase().includes(catQuery.toLowerCase())
      ),
    [categories, catQuery]
  );
  const catPageCount = Math.max(
    1,
    Math.ceil(filteredCategories.length / pageSize)
  );
  const catPaged = useMemo(
    () =>
      filteredCategories.slice((catPage - 1) * pageSize, catPage * pageSize),
    [filteredCategories, catPage]
  );

  // COMPANY
  const [compPage, setCompPage] = useState(1);
  const filteredCompanies = useMemo(
    () =>
      companies.filter((c) =>
        c.name_company.toLowerCase().includes(companyQuery.toLowerCase())
      ),
    [companies, companyQuery]
  );
  const compPageCount = Math.max(
    1,
    Math.ceil(filteredCompanies.length / pageSize)
  );
  const compPaged = useMemo(
    () =>
      filteredCompanies.slice((compPage - 1) * pageSize, compPage * pageSize),
    [filteredCompanies, compPage]
  );

  // UNIT
  const [unitPage, setUnitPage] = useState(1);
  const filteredUnits = useMemo(
    () =>
      units.filter((u) =>
        u.name_unit.toLowerCase().includes(unitQuery.toLowerCase())
      ),
    [units, unitQuery]
  );
  const unitPageCount = Math.max(1, Math.ceil(filteredUnits.length / pageSize));
  const unitPaged = useMemo(
    () => filteredUnits.slice((unitPage - 1) * pageSize, unitPage * pageSize),
    [filteredUnits, unitPage]
  );

  // SPENDING
  const [spPage, setSpPage] = useState(1);
  const filteredSpendings = useMemo(
    () =>
      spendings
        .filter(
          (s) =>
            `${s.name_spending} ${s.category_id} ${s.company_id ?? ""}`
              .toLowerCase()
              .includes(spendingQuery.toLowerCase()) &&
            (dateQuery ? s.date_spending.includes(dateQuery) : true) // <— Date Filter
        )
        .sort((a, b) => a.id - b.id),
    [spendings, spendingQuery, dateQuery]
  );
  const spPageCount = Math.max(
    1,
    Math.ceil(filteredSpendings.length / pageSize)
  );
  const spPaged = useMemo(
    () => filteredSpendings.slice((spPage - 1) * pageSize, spPage * pageSize),
    [filteredSpendings, spPage]
  );

  // MEDICINE
  const [medPage, setMedPage] = useState(1);
  const filteredMeds = useMemo(
    () =>
      medicines.filter((m) =>
        `${m.name_medicine} ${m.detail_spending_id}`
          .toLowerCase()
          .includes(medQuery.toLowerCase())
      ),
    [medicines, medQuery]
  );
  const medPageCount = Math.max(1, Math.ceil(filteredMeds.length / pageSize));
  const medPaged = useMemo(
    () => filteredMeds.slice((medPage - 1) * pageSize, medPage * pageSize),
    [filteredMeds, medPage]
  );

  const errToText = (e: any) => {
    const data = e?.response?.data;
    if (typeof data === "string") return data;
    if (data?.error) return String(data.error);
    if (data?.message) return String(data.message);
    if (e?.message) return String(e.message);
    try {
      return JSON.stringify(data ?? e);
    } catch {
      return "Terjadi kesalahan";
    }
  };

  const getCategories = async () => {
    try {
      const res = await axiosInstance.get("/api/CategorySpending"); // <—
      setCategories(res.data);
    } catch (e: any) {
      const msgOf = (e: any) =>
        e?.response?.data?.error ||
        e?.response?.data?.message ||
        (typeof e?.response?.data === "string" ? e.response.data : "") ||
        e?.message ||
        "Terjadi kesalahan";
      setAlert({ open: true, message: errToText(e), severity: "error" });
    }
  };

  const getCompanies = async () => {
    try {
      const res = await axiosInstance.get("/api/CompanyMedicine"); // <—
      setCompanies(res.data);
    } catch (e: any) {
      setAlert({ open: true, message: errToText(e), severity: "error" });
    }
  };
  const getUnits = async () => {
    try {
      const res = await axiosInstance.get("/api/unitMedicine");
      setUnits(res.data);
    } catch (e: any) {
      setAlert({ open: true, message: errToText(e), severity: "error" });
    }
  };
  const getSpendings = async () => {
    try {
      const res = await axiosInstance.get("/api/spending");
      setSpendings(res.data);
    } catch (e: any) {
      setAlert({ open: true, message: errToText(e), severity: "error" });
    }
  };
  const getMedicinesBySpendingId = async (detail_spending_id: number) => {
    try {
      const res = await axiosInstance.post(
        "/api/spendingMedicineBySpendingId",
        { detail_spending_id }
      );
      setMedicines(res.data);
    } catch (e: any) {
      setAlert({ open: true, message: errToText(e), severity: "error" });
    }
  };

  useEffect(() => {
    getCategories();
    getCompanies();
    getUnits();
    getSpendings();
  }, []);

  // ====== CATEGORY: Edit/Hapus (TETAP) ======
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const openEditCategory = (c: Category) => {
    setEditingCategory(c);
    setEditCategoryName(c.name_category);
  };
  const saveEditCategory = async () => {
    if (!editingCategory) return;
    try {
      setLoading(true);
      await axiosInstance.put(`/api/categorySpending/${editingCategory.id}`, {
        name_category: editCategoryName,
      });
      setAlert({
        open: true,
        message: "✅ Kategori diupdate",
        severity: "success",
      });
      setEditingCategory(null);
      getCategories();
    } catch (e: any) {
      setAlert({
        open: true,
        message: e?.response?.data || "Gagal update kategori",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };
  const deleteCategory = async (id: number) => {
    // if (!confirm("Hapus kategori ini?")) return
    setDeleteDialog({ open: true, id, type: "category" });
  };

  const confirmDeleteCategory = async () => {
    if (!deleteDialog.id) return;
    try {
      setLoading(true);
      await axiosInstance.delete(`/api/categorySpending/${deleteDialog.id}`);
      setAlert({
        open: true,
        message: "🗑️ Kategori dihapus",
        severity: "success",
      });
      getCategories();
    } catch (e: any) {
      setAlert({ open: true, message: errToText(e), severity: "error" });
    } finally {
      setLoading(false);
      setDeleteDialog({ ...deleteDialog, open: false });
    }
  };

  // ====== COMPANY: Edit/Hapus (TETAP) ======
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [editCompanyName, setEditCompanyName] = useState("");
  const openEditCompany = (c: Company) => {
    setEditingCompany(c);
    setEditCompanyName(c.name_company);
  };
  const saveEditCompany = async () => {
    if (!editingCompany) return;
    try {
      setLoading(true);
      await axiosInstance.put(`/api/companyMedicine/${editingCompany.id}`, {
        name_company: editCompanyName,
      });
      setAlert({
        open: true,
        message: "✅ Perusahaan diupdate",
        severity: "success",
      });
      setEditingCompany(null);
      getCompanies();
    } catch (e: any) {
      setAlert({ open: true, message: errToText(e), severity: "error" });
    } finally {
      setLoading(false);
    }
  };
  const deleteCompany = async (id: number) => {
    // if (!confirm("Hapus perusahaan ini?")) return
    setDeleteDialog({ open: true, id, type: "company" });
  };

  const confirmDeleteCompany = async () => {
    if (!deleteDialog.id) return;
    try {
      setLoading(true);
      await axiosInstance.delete(`/api/companyMedicine/${deleteDialog.id}`);
      setAlert({
        open: true,
        message: "🗑️ Perusahaan dihapus",
        severity: "success",
      });
      getCompanies();
    } catch (e: any) {
      setAlert({ open: true, message: errToText(e), severity: "error" });
    } finally {
      setLoading(false);
      setDeleteDialog({ ...deleteDialog, open: false });
    }
  };

  // ====== UNIT: Tambah/Edit/Hapus (TETAP) ======
  const [unitName, setUnitName] = useState("");
  const [editingUnit, setEditingUnit] = useState<UnitMed | null>(null);
  const [editUnitName, setEditUnitName] = useState("");
  const addUnit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!unitName.trim())
      return setAlert({
        open: true,
        message: "Nama unit wajib diisi!",
        severity: "error",
      });
    try {
      setLoading(true);
      await axiosInstance.post("/api/unitMedicine", { name_unit: unitName });
      setAlert({
        open: true,
        message: "✅ Unit ditambahkan",
        severity: "success",
      });
      setUnitName("");
      getUnits();
    } catch (e: any) {
      setAlert({ open: true, message: errToText(e), severity: "error" });
    } finally {
      setLoading(false);
    }
  };
  const openEditUnit = (u: UnitMed) => {
    setEditingUnit(u);
    setEditUnitName(u.name_unit);
  };
  const saveEditUnit = async () => {
    if (!editingUnit) return;
    try {
      setLoading(true);
      await axiosInstance.put(`/api/unitMedicine/${editingUnit.id}`, {
        name_unit: editUnitName,
      });
      setAlert({
        open: true,
        message: "✅ Unit diupdate",
        severity: "success",
      });
      setEditingUnit(null);
      getUnits();
    } catch (e: any) {
      setAlert({ open: true, message: errToText(e), severity: "error" });
    } finally {
      setLoading(false);
    }
  };
  const deleteUnit = async (id: number) => {
    // if (!confirm("Hapus unit ini?")) return
    setDeleteDialog({ open: true, id, type: "unit" });
  };

  const confirmDeleteUnit = async () => {
    if (!deleteDialog.id) return;
    try {
      setLoading(true);
      await axiosInstance.delete(`/api/unitMedicine/${deleteDialog.id}`);
      setAlert({ open: true, message: "🗑️ Unit dihapus", severity: "success" });
      getUnits();
    } catch (e: any) {
      setAlert({ open: true, message: errToText(e), severity: "error" });
    } finally {
      setLoading(false);
      setDeleteDialog({ ...deleteDialog, open: false });
    }
  };

  // ====== SPENDING: Edit/Hapus (TETAP) ======
  const [editingSpending, setEditingSpending] = useState<Spending | null>(null);
  const [spForm, setSpForm] = useState({
    name_spending: "",
    amount_spending: "",
    category_id: "",
    date_spending: "",
    company_id: "",
  });
  const openEditSpending = (s: Spending) => {
    setEditingSpending(s);
    setSpForm({
      name_spending: s.name_spending,
      amount_spending: String(s.amount_spending ?? ""),
      category_id: String(s.category_id),
      date_spending: s.date_spending.split("T")[0],
      company_id: s.company_id ? String(s.company_id) : "",
    });
  };
  const saveEditSpending = async () => {
    if (!editingSpending) return;
    try {
      setLoading(true);
      await axiosInstance.put(`/api/detailSpending/${editingSpending.id}`, {
        name_spending: spForm.name_spending,
        category_id: Number(spForm.category_id), 
        date_spending: spForm.date_spending,
        ...(Number(spForm.category_id) !== 9 && {
          amount_spending: Number(spForm.amount_spending || 0),
        }),
        ...(Number(spForm.category_id) === 9
          ? { company_id: Number(spForm.company_id || 0) }
          : { company_id: null }),
      });
      setAlert({
        open: true,
        message: "✅ Spending diupdate",
        severity: "success",
      });
      setEditingSpending(null);
      getSpendings();
    } catch (e: any) {
      setAlert({ open: true, message: errToText(e), severity: "error" });
    } finally {
      setLoading(false);
    }
  };
  const deleteSpending = async (id: number) => {
    // if (!confirm("Hapus transaksi ini beserta semua detail obat?")) return
    setDeleteDialog({ open: true, id, type: "spending" });
  };

  const originalCategory = editingSpending?.category_id; // kategori lama


  const confirmDeleteSpending = async () => {
    if (!deleteDialog.id) return;
    try {
      setLoading(true);
      await axiosInstance.delete(`/api/detailSpending/${deleteDialog.id}`);
      setAlert({
        open: true,
        message: "🗑️ Spending dihapus",
        severity: "success",
      });
      getSpendings();
    } catch (e: any) {
      setAlert({ open: true, message: errToText(e), severity: "error" });
    } finally {
      setLoading(false);
      setDeleteDialog({ ...deleteDialog, open: false });
    }
  };

  // ====== MEDICINE: Edit/Hapus (TETAP) ======
  const [editingMed, setEditingMed] = useState<MedicineDetail | null>(null);
  const [medForm, setMedForm] = useState({
    name_medicine: "",
    quantity: "",
    name_unit_id: "",
    price_per_item: "",
  });
  const startEditMed = (m: MedicineDetail) => {
    setEditingMed(m);
    setMedForm({
      name_medicine: m.name_medicine || "",
      quantity: String(m.quantity || ""),
      name_unit_id: String(m.name_unit_id || ""),
      price_per_item: String(m.price_per_item || ""),
    });
  };
  const saveEditMed = async () => {
    if (!editingMed) return;
    try {
      setLoading(true);
      await axiosInstance.put(`/api/detailMedicineSpending/${editingMed.id}`, {
        name_medicine: medForm.name_medicine,
        quantity: Number(medForm.quantity || 0),
        name_unit_id: Number(medForm.name_unit_id || 0),
        price_per_item: Number(medForm.price_per_item || 0),
      });
      setAlert({
        open: true,
        message: "✅ Detail obat diupdate",
        severity: "success",
      });
      if (medSearchSpendingId)
        await getMedicinesBySpendingId(Number(medSearchSpendingId));
      setEditingMed(null);
    } catch (e: any) {
      setAlert({ open: true, message: errToText(e), severity: "error" });
    } finally {
      setLoading(false);
    }
  };
  const deleteMed = async (id: number) => {
    // if (!confirm("Hapus obat ini?")) return
    setDeleteDialog({ open: true, id, type: "medicine" });
  };

  const confirmDeleteMed = async () => {
    if (!deleteDialog.id) return;
    try {
      setLoading(true);
      await axiosInstance.delete(
        `/api/detailMedicineSpending/${deleteDialog.id}`
      );
      setAlert({ open: true, message: "🗑️ Obat dihapus", severity: "success" });
      if (medSearchSpendingId)
        await getMedicinesBySpendingId(Number(medSearchSpendingId));
    } catch (e: any) {
      setAlert({ open: true, message: errToText(e), severity: "error" });
    } finally {
      setLoading(false);
      setDeleteDialog({ ...deleteDialog, open: false });
    }
  };
  const searchMedBySpending = async () => {
    const id = Number(medSearchSpendingId || 0);
    if (!id)
      return setAlert({
        open: true,
        message: "Isi Spending ID dulu",
        severity: "error",
      });
    await getMedicinesBySpendingId(id);
  };

  // ===== DELETE DIALOG STATE =====
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    id: number | null;
    type: "category" | "company" | "unit" | "spending" | "medicine";
  }>({ open: false, id: null, type: "spending" });

  const handleDeleteConfirm = () => {
    switch (deleteDialog.type) {
      case "category":
        return confirmDeleteCategory();
      case "company":
        return confirmDeleteCompany();
      case "unit":
        return confirmDeleteUnit();
      case "spending":
        return confirmDeleteSpending();
      case "medicine":
        return confirmDeleteMed();
    }
  };


  // ===== Render =====
  return (
    <main className="min-h-screen font-serif text-[#ECECEC] px-6 md:px-20 py-24 bg-gradient-to-b from-[#0f141a]/70 via-[#1c2430]/80 to-[#12171d]/90 backdrop-blur-xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold text-[#FFD700] drop-shadow-[0_2px_10px_rgba(255,215,0,0.2)]">
          EDIT & MANAGE SPENDING
        </h1>
        <p className="text-gray-300 mt-4 text-lg max-w-3xl mx-auto">
          Ubah data belanja, perusahaan, unit, dan detail obat — dengan tampilan
          konsisten.
        </p>
        <div className="w-28 h-[4px] bg-gradient-to-r from-[#2C3E50] to-[#FFD700] mx-auto mt-6 rounded-full" />
      </motion.div>

      {/* Container */}
      <Box
        sx={{
          width: "100%",
          maxWidth: "1200px",
          p: { xs: 2, md: 3 },
          borderRadius: "20px",
          border: "1px solid rgba(255,215,0,0.20)",
          background: "rgba(18,23,29,0.55)",
          backdropFilter: "blur(16px)",
          boxShadow: "0 0 25px rgba(255,215,0,0.08)",
          mx: "auto", // <— ini bikin center
        }}
      >
        {/* Tabs MUI di-skin agar mirip Tabs custom */}
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            "& .MuiTab-root": {
              color: "#D1D5DB",
              textTransform: "none",
              fontWeight: 600,
              mr: 1,
              borderRadius: "12px",
              px: 2,
              "&.Mui-selected": {
                color: "#12171d",
                backgroundColor: "#FFD700",
              },
            },
          }}
          TabIndicatorProps={{
            sx: {
              height: "0px",
            },
          }}
        >
          <Tab label="Category" />
          <Tab label="Company" />
          <Tab label="Unit" />
          <Tab label="Spending" />
          <Tab label="Medicine Detail" />
        </Tabs>

        {/* ========== CATEGORY TAB ========== */}
        {tab === 0 && (
          <section className="mt-5">
            <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between mb-3">
              <div className="flex items-center gap-2 w-full md:w-1/2">
                <Search fontSize="small" />
                <CustomTextField
                  fullWidth
                  size="small"
                  placeholder="Cari kategori..."
                  value={catQuery}
                  onChange={(e: any) => setCatQuery(e.target.value)}
                  sx={{
                    "& .MuiInputBase-input": { fontSize: 18, py: 2 }, // tinggi & ukuran teks input
                    "& .MuiInputLabel-root": { fontSize: 16 }, // label
                  }}
                />
              </div>
              <Tooltip title="Refresh">
                <span>
                  <IconButton
                    onClick={getCategories}
                    disabled={loading}
                    sx={{ color: "#FFD700" }}
                  >
                    <Refresh />
                  </IconButton>
                </span>
              </Tooltip>
            </div>

            <Paper
              sx={{
                background: "transparent",
                borderRadius: "16px",
                border: "1px solid rgba(255,215,0,0.2)",
              }}
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    {["ID", "Nama Kategori", "Aksi"].map((h) => (
                      <TableCell
                        key={h}
                        sx={{
                          fontWeight: "bold",
                          background: "#FFD700",
                          color: "#12171d",
                        }}
                      >
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {catPaged.map((c) => (
                    <TableRow
                      key={c.id}
                      hover
                      sx={{ "& td": { color: "#ECECEC" } }}
                    >
                      <TableCell>{c.id}</TableCell>
                      <TableCell>{c.name_category}</TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => openEditCategory(c)}
                          sx={{ color: "#FFE55C" }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => deleteCategory(c.id)}
                          sx={{ color: "#ff6363" }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {catPaged.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} sx={{ color: "#ECECEC" }}>
                        Tidak ada data
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Paper>

            <div className="flex justify-center mt-3">
              <Pagination
                count={catPageCount}
                page={catPage}
                onChange={(_, v) => setCatPage(v)}
                sx={{
                  "& .MuiPaginationItem-root": { color: "#ECECEC" },
                  "& .Mui-selected": { bgcolor: "#FFD700", color: "#12171d" },
                }}
              />
            </div>

            <Dialog
              open={!!editingCategory}
              onClose={() => setEditingCategory(null)}
              PaperProps={{
                sx: {
                  background: "rgba(18,23,29,0.95)",
                  border: "1px solid rgba(255,215,0,0.25)",
                  color: "#ECECEC",
                  borderRadius: "16px",
                },
              }}
            >
              <DialogTitle>Edit Kategori</DialogTitle>
              <DialogContent>
                <CustomTextField
                  fullWidth
                  label="Nama Kategori"
                  sx={{
                    "& .MuiInputBase-input": { fontSize: 18, py: 2 }, // tinggi & ukuran teks input
                    "& .MuiInputLabel-root": { fontSize: 16 }, // label
                  }}
                  value={editCategoryName}
                  onChange={(e: any) => setEditCategoryName(e.target.value)}
                />
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => setEditingCategory(null)}
                  sx={{ color: "#ECECEC" }}
                >
                  Batal
                </Button>
                <Button
                  onClick={saveEditCategory}
                  variant="contained"
                  disabled={loading}
                  sx={{
                    bgcolor: "#FFD700",
                    color: "#12171d",
                    fontWeight: 700,
                    "&:hover": { bgcolor: "#FFE55C" },
                  }}
                >
                  Simpan
                </Button>
              </DialogActions>
            </Dialog>
          </section>
        )}

        {/* ========== COMPANY TAB ========== */}
        {tab === 1 && (
          <section className="mt-5">
            <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between mb-3">
              <div className="flex items-center gap-2 w-full md:w-1/2">
                <Search fontSize="small" />
                <CustomTextField
                  fullWidth
                  size="small"
                  placeholder="Cari perusahaan..."
                  value={companyQuery}
                  onChange={(e: any) => setCompanyQuery(e.target.value)}
                />
              </div>
              <Tooltip title="Refresh">
                <span>
                  <IconButton
                    onClick={getCompanies}
                    disabled={loading}
                    sx={{ color: "#FFD700" }}
                  >
                    <Refresh />
                  </IconButton>
                </span>
              </Tooltip>
            </div>

            <Paper
              sx={{
                background: "transparent",
                borderRadius: "16px",
                border: "1px solid rgba(255,215,0,0.2)",
              }}
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    {["No", "Nama Perusahaan", "Created At", "Aksi"].map(
                      (h) => (
                        <TableCell
                          key={h}
                          sx={{
                            fontWeight: "bold",
                            background: "#FFD700",
                            color: "#12171d",
                          }}
                        >
                          {h}
                        </TableCell>
                      )
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {compPaged.map((c, index) => (
                    <TableRow
                      key={c.id}
                      hover
                      sx={{ "& td": { color: "#ECECEC" } }}
                    >
                      <TableCell>
                        {(compPage - 1) * pageSize + index + 1}
                      </TableCell>
                      <TableCell>{c.name_company}</TableCell>
                      <TableCell>
                        {c.created_at
                          ? new Date(c.created_at).toLocaleString("id-ID")
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => openEditCompany(c)}
                          sx={{ color: "#FFE55C" }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => deleteCompany(c.id)}
                          sx={{ color: "#ff6363" }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {compPaged.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} sx={{ color: "#ECECEC" }}>
                        Tidak ada data
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Paper>

            <div className="flex justify-center mt-3">
              <Pagination
                count={compPageCount}
                page={compPage}
                onChange={(_, v) => setCompPage(v)}
                sx={{
                  "& .MuiPaginationItem-root": { color: "#ECECEC" },
                  "& .Mui-selected": { bgcolor: "#FFD700", color: "#12171d" },
                }}
              />
            </div>

            <Dialog
              open={!!editingCompany}
              onClose={() => setEditingCompany(null)}
              PaperProps={{
                sx: {
                  background: "rgba(18,23,29,0.95)",
                  border: "1px solid rgba(255,215,0,0.25)",
                  color: "#ECECEC",
                  borderRadius: "16px",
                },
              }}
            >
              <DialogTitle>Edit Perusahaan</DialogTitle>
              <DialogContent>
                <CustomTextField
                  fullWidth
                  label="Nama Perusahaan"
                  sx={{ mt: 1 }}
                  value={editCompanyName}
                  onChange={(e: any) => setEditCompanyName(e.target.value)}
                />
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => setEditingCompany(null)}
                  sx={{ color: "#ECECEC" }}
                >
                  Batal
                </Button>
                <Button
                  onClick={saveEditCompany}
                  variant="contained"
                  disabled={loading}
                  sx={{
                    bgcolor: "#FFD700",
                    color: "#12171d",
                    fontWeight: 700,
                    "&:hover": { bgcolor: "#FFE55C" },
                  }}
                >
                  Simpan
                </Button>
              </DialogActions>
            </Dialog>
          </section>
        )}

        {/* ========== UNIT TAB ========== */}
        {tab === 2 && (
          <section className="mt-5">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-3 mb-3">
              <div className="flex items-center gap-2 w-full md:w-1/2">
                <Search fontSize="small" />
                <CustomTextField
                  fullWidth
                  size="small"
                  placeholder="Cari unit..."
                  value={unitQuery}
                  onChange={(e: any) => setUnitQuery(e.target.value)}
                />
              </div>
              <form onSubmit={addUnit} className="flex gap-2 w-full md:w-1/2">
                <CustomTextField
                  fullWidth
                  label="Tambah Unit Baru"
                  value={unitName}
                  onChange={(e: any) => setUnitName(e.target.value)}
                />
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{
                    bgcolor: "#FFD700",
                    color: "#12171d",
                    fontWeight: 700,
                    px: 3,
                    "&:hover": { bgcolor: "#FFE55C" },
                  }}
                >
                  Tambah
                </Button>
                <Tooltip title="Refresh">
                  <span>
                    <IconButton
                      onClick={getUnits}
                      disabled={loading}
                      sx={{ color: "#FFD700" }}
                    >
                      <Refresh />
                    </IconButton>
                  </span>
                </Tooltip>
              </form>
            </div>

            <Paper
              sx={{
                background: "transparent",
                borderRadius: "16px",
                border: "1px solid rgba(255,215,0,0.2)",
              }}
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    {["ID", "Nama Unit", "Aksi"].map((h) => (
                      <TableCell
                        key={h}
                        sx={{
                          fontWeight: "bold",
                          background: "#FFD700",
                          color: "#12171d",
                        }}
                      >
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {unitPaged.map((u) => (
                    <TableRow
                      key={u.id}
                      hover
                      sx={{ "& td": { color: "#ECECEC" } }}
                    >
                      <TableCell>{u.id}</TableCell>
                      <TableCell>{u.name_unit}</TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => openEditUnit(u)}
                          sx={{ color: "#FFE55C" }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => deleteUnit(u.id)}
                          sx={{ color: "#ff6363" }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {unitPaged.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} sx={{ color: "#ECECEC" }}>
                        Tidak ada data
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Paper>

            <div className="flex justify-center mt-3">
              <Pagination
                count={unitPageCount}
                page={unitPage}
                onChange={(_, v) => setUnitPage(v)}
                sx={{
                  "& .MuiPaginationItem-root": { color: "#ECECEC" },
                  "& .Mui-selected": { bgcolor: "#FFD700", color: "#12171d" },
                }}
              />
            </div>

            <Dialog
              open={!!editingUnit}
              onClose={() => setEditingUnit(null)}
              PaperProps={{
                sx: {
                  background: "rgba(18,23,29,0.95)",
                  border: "1px solid rgba(255,215,0,0.25)",
                  color: "#ECECEC",
                  borderRadius: "16px",
                },
              }}
            >
              <DialogTitle>Edit Unit</DialogTitle>
              <DialogContent>
                <CustomTextField
                  fullWidth
                  label="Nama Unit"
                  sx={{ mt: 1 }}
                  value={editUnitName}
                  onChange={(e: any) => setEditUnitName(e.target.value)}
                />
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => setEditingUnit(null)}
                  sx={{ color: "#ECECEC" }}
                >
                  Batal
                </Button>
                <Button
                  onClick={saveEditUnit}
                  variant="contained"
                  disabled={loading}
                  sx={{
                    bgcolor: "#FFD700",
                    color: "#12171d",
                    fontWeight: 700,
                    "&:hover": { bgcolor: "#FFE55C" },
                  }}
                >
                  Simpan
                </Button>
              </DialogActions>
            </Dialog>
          </section>
        )}

        {/* ========== SPENDING TAB ========== */}
        {tab === 3 && (
          <section className="mt-5">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-3 mb-3">
              <div className="flex items-center gap-2 w-full md:w-2/3">
                <Search fontSize="small" />
                <CustomTextField
                  fullWidth
                  size="small"
                  placeholder="Cari spending (nama/category/company)..."
                  value={spendingQuery}
                  onChange={(e: any) => setSpendingQuery(e.target.value)}
                />
                <CustomTextField
                  type="date"
                  size="small"
                  value={dateQuery}
                  onChange={(e: any) => setDateQuery(e.target.value)}
                  sx={{ width: 200 }}
                />
              </div>
              <Tooltip title="Refresh">
                <span>
                  <IconButton
                    onClick={getSpendings}
                    disabled={loading}
                    sx={{ color: "#FFD700" }}
                  >
                    <Refresh />
                  </IconButton>
                </span>
              </Tooltip>
            </div>

            <Paper
              sx={{
                background: "transparent",
                borderRadius: "16px",
                border: "1px solid rgba(255,215,0,0.2)",
              }}
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    {[
                      "ID",
                      "Nama",
                      "Jumlah",
                      "Kategori",
                      "Company",
                      "Tanggal",
                      "Aksi",
                    ].map((h) => (
                      <TableCell
                        key={h}
                        sx={{
                          fontWeight: "bold",
                          background: "#FFD700",
                          color: "#12171d",
                        }}
                      >
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {spPaged.map((s, index) => (
                    <TableRow
                      key={s.id}
                      hover
                      sx={{ "& td": { color: "#ECECEC" } }}
                    >
                      <TableCell>{s.id}</TableCell>
                      <TableCell>{s.name_spending}</TableCell>
                      <TableCell>{rupiah(s.amount_spending)}</TableCell>
                      <TableCell>{s.category_id}</TableCell>
                      <TableCell>{s.company_id ?? "-"}</TableCell>
                      <TableCell>
                        {new Date(s.date_spending).toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => openEditSpending(s)}
                          sx={{ color: "#FFE55C" }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => deleteSpending(s.id)}
                          sx={{ color: "#ff6363" }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {spPaged.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} sx={{ color: "#ECECEC" }}>
                        Tidak ada data
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Paper>

            <div className="flex justify-center mt-3">
              <Pagination
                count={spPageCount}
                page={spPage}
                onChange={(_, v) => setSpPage(v)}
                sx={{
                  "& .MuiPaginationItem-root": { color: "#ECECEC" },
                  "& .Mui-selected": { bgcolor: "#FFD700", color: "#12171d" },
                }}
              />
            </div>

            {/* Edit Spending Dialog */}
            <Dialog
              open={!!editingSpending}
              onClose={() => setEditingSpending(null)}
              maxWidth="sm"
              fullWidth
              PaperProps={{
                sx: {
                  background: "rgba(18,23,29,0.95)",
                  border: "1px solid rgba(255,215,0,0.25)",
                  color: "#ECECEC",
                  borderRadius: "16px",
                },
              }}
            >
              <DialogTitle>Edit Spending</DialogTitle>
              <DialogContent className="flex flex-col gap-3">
                <CustomTextField
                  label="Nama Spending"
                  fullWidth
                  value={spForm.name_spending}
                  onChange={(e: any) =>
                    setSpForm({ ...spForm, name_spending: e.target.value })
                  }
                />
                
                <CustomTextField
                    select
                    label="Kategori"
                    fullWidth
                    value={spForm.category_id}
                    onChange={(e: any) =>
                        setSpForm({ ...spForm, category_id: e.target.value })
                    }
                    >
                    {categories.map((c) => {
                        const current = String(c.id);

                        const disable =
                        // jika awalnya kategori 9, maka hanya boleh tetap 9
                        (String(originalCategory) === "9" && current !== "9") ||
                        // jika awalnya bukan 9, maka tidak boleh pilih 9
                        (String(originalCategory) !== "9" && current === "9");

                        return (
                        <MenuItem key={c.id} value={String(c.id)} disabled={disable}>
                            {c.name_category}
                        </MenuItem>
                        );
                    })}
                    </CustomTextField>
                <CustomTextField
                  label="Tanggal"
                  type="date"
                  fullWidth
                  value={spForm.date_spending}
                  onChange={(e: any) =>
                    setSpForm({ ...spForm, date_spending: e.target.value })
                  }
                  InputLabelProps={{ shrink: true }}
                />
                {spForm.category_id === "9" && (
                  <CustomTextField
                    label="Company ID (khusus kategori 9)"
                    fullWidth
                    value={spForm.company_id}
                    onChange={(e: any) =>
                      setSpForm({ ...spForm, company_id: e.target.value })
                    }
                  />
                )}
                {spForm.category_id !== "9" && (
                  <CustomTextField
                    label="Amount (Rp)"
                    fullWidth
                    value={
                      spForm.category_id === "9"
                        ? ""
                        : new Intl.NumberFormat("id-ID").format(
                            Number(spForm.amount_spending || 0)
                          )
                    }
                    onChange={(e: any) => {
                      if (spForm.category_id === "9") return;

                      const raw = e.target.value.replace(/\D/g, ""); // hanya angka
                      setSpForm({ ...spForm, amount_spending: raw });
                    }}
                    disabled={spForm.category_id === "9"}
                  />
                )}
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => setEditingSpending(null)}
                  sx={{ color: "#ECECEC" }}
                >
                  Batal
                </Button>
                <Button
                  onClick={saveEditSpending}
                  variant="contained"
                  disabled={loading}
                  sx={{
                    bgcolor: "#FFD700",
                    color: "#12171d",
                    fontWeight: 700,
                    "&:hover": { bgcolor: "#FFE55C" },
                    position: "relative",
                    zIndex: 10,
                  }}
                >
                  Simpan
                </Button>
              </DialogActions>
            </Dialog>
          </section>
        )}

        {/* ========== MEDICINE DETAIL TAB ========== */}
        {tab === 4 && (
          <section className="mt-5">
            <div className="flex flex-col md:flex-row gap-3 items-start md:items-end mb-3">
              <div className="flex items-end gap-2 w-full md:w-1/2">
                <CustomTextField
                  fullWidth
                  label="Cari berdasarkan Spending ID"
                  value={medSearchSpendingId}
                  onChange={(e: any) =>
                    setMedSearchSpendingId(
                      String(e.target.value).replace(/[^0-9]/g, "")
                    )
                  }
                  inputProps={{ inputMode: "numeric" } as any}
                />
                <Button
                  variant="contained"
                  onClick={searchMedBySpending}
                  sx={{
                    bgcolor: "#FFD700",
                    color: "#12171d",
                    fontWeight: 700,
                    "&:hover": { bgcolor: "#FFE55C" },
                    position: "relative",
                    zIndex: 10,
                  }}
                >
                  Cari
                </Button>
              </div>
            </div>

            <Paper
              sx={{
                background: "transparent",
                borderRadius: "16px",
                border: "1px solid rgba(255,215,0,0.2)",
              }}
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    {[
                      "ID",
                      "Spending ID",
                      "Nama Obat",
                      "Qty",
                      "Unit",
                      "Harga per Item (Rp)",
                      "Aksi",
                    ].map((h) => (
                      <TableCell
                        key={h}
                        sx={{
                          fontWeight: "bold",
                          background: "#FFD700",
                          color: "#12171d",
                        }}
                      >
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {medPaged.map((m) => (
                    <TableRow
                      key={m.id}
                      hover
                      sx={{ "& td": { color: "#ECECEC" } }}
                    >
                      <TableCell>{m.id}</TableCell>
                      <TableCell>{m.detail_spending_id}</TableCell>
                      <TableCell>{m.name_medicine}</TableCell>
                      <TableCell>{m.quantity}</TableCell>
                      <TableCell>{m.name_unit ?? m.name_unit_id}</TableCell>
                      <TableCell>{rupiah(m.price_per_item)}</TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => startEditMed(m)}
                          sx={{ color: "#FFE55C" }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => deleteMed(m.id)}
                          sx={{ color: "#ff6363" }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>

            <div className="flex justify-center mt-3">
              <Pagination
                count={medPageCount}
                page={medPage}
                onChange={(_, v) => setMedPage(v)}
                sx={{
                  "& .MuiPaginationItem-root": { color: "#ECECEC" },
                  "& .Mui-selected": { bgcolor: "#FFD700", color: "#12171d" },
                }}
              />
            </div>

            {/* Edit Medicine Dialog */}
            <Dialog
              open={!!editingMed}
              onClose={() => setEditingMed(null)}
              maxWidth="sm"
              fullWidth
              PaperProps={{
                sx: {
                  background: "rgba(18,23,29,0.95)",
                  border: "1px solid rgba(255,215,0,0.35)",
                  color: "#ECECEC",
                  borderRadius: "20px",
                  p: 3,
                  boxShadow: "0 0 40px rgba(255,215,0,0.15)",
                },
              }}
            >
              <DialogTitle
                sx={{
                  fontSize: "1.8rem",
                  fontWeight: 700,
                  textAlign: "center",
                  color: "#FFD700",
                  letterSpacing: "0.5px",
                  mb: 2,
                }}
              >
                Edit Detail Obat
              </DialogTitle>

              <DialogContent
                className="flex flex-col gap-4"
                sx={{
                  "& .MuiInputBase-input": {
                    fontSize: "1.2rem",
                    py: 2.5,
                  },
                  "& .MuiInputLabel-root": {
                    fontSize: "1.1rem",
                  },
                }}
              >
                <CustomTextField
                  label="Nama Obat"
                  fullWidth
                  value={medForm.name_medicine}
                  onChange={(e: any) =>
                    setMedForm({ ...medForm, name_medicine: e.target.value })
                  }
                />

                <CustomTextField
                  label="Quantity"
                  fullWidth
                  value={medForm.quantity}
                  onChange={(e: any) =>
                    setMedForm({
                      ...medForm,
                      quantity: String(e.target.value).replace(/[^0-9]/g, ""),
                    })
                  }
                />

                <CustomTextField
                  select
                  label="Unit"
                  fullWidth
                  value={medForm.name_unit_id}
                  onChange={(e: any) =>
                    setMedForm({ ...medForm, name_unit_id: e.target.value })
                  }
                >
                  {units.map((u) => (
                    <MenuItem key={u.id} value={String(u.id)}>
                      {u.name_unit}
                    </MenuItem>
                  ))}
                </CustomTextField>

                <CustomTextField
                  label="Harga per Item (Rp)"
                  fullWidth
                  value={new Intl.NumberFormat("id-ID").format(
                    Number(medForm.price_per_item || 0)
                  )}
                  onChange={(e: any) => {
                    const numeric = e.target.value.replace(/[^0-9]/g, "");
                    setMedForm({ ...medForm, price_per_item: numeric });
                  }}
                />
              </DialogContent>

              <DialogActions sx={{ justifyContent: "space-between", mt: 2 }}>
                <Button
                  onClick={() => setEditingMed(null)}
                  sx={{ color: "#ECECEC", fontSize: "1.1rem", fontWeight: 600 }}
                >
                  BATAL
                </Button>
                <Button
                  onClick={saveEditMed}
                  variant="contained"
                  disabled={loading}
                  sx={{
                    bgcolor: "#FFD700",
                    color: "#12171d",
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    px: 4,
                    py: 1.2,
                    borderRadius: "10px",
                    "&:hover": { bgcolor: "#FFE55C" },
                  }}
                >
                  SIMPAN
                </Button>
              </DialogActions>
            </Dialog>
          </section>
        )}

        {/* DELETE CONFIRM DIALOG */}
        <DeleteConfirmDialog
          open={deleteDialog.open}
          onClose={() => setDeleteDialog({ ...deleteDialog, open: false })}
          onConfirm={handleDeleteConfirm}
          title={`Hapus ${deleteDialog.type}?`}
          description="Data yang dihapus tidak dapat dikembalikan."
          loading={loading}
        />
      </Box>

      {/* ALERT */}
      <Snackbar
        open={alert.open}
        autoHideDuration={3000}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={alert.severity}
          variant="filled"
          sx={{ fontSize: "1.05rem", borderRadius: "10px" }}
        >
          {alert.message}
        </Alert>
      </Snackbar>

      {/* GLOBAL LOADING OVERLAY (subtle) */}
      {loading && (
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center">
          <CircularProgress sx={{ color: "#FFD700" }} />
        </div>
      )}
    </main>
  );
}
