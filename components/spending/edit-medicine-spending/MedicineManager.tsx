/**
 * @component MedicineManager
 * @description Smart component (Container) that orchestrates CRUD operations
 * for Medicine Details. It manages the state and logic, while delegating
 * UI rendering to dumb components (MedicineList, EditModal).
 */

"use client";

import { useState, useEffect, useMemo } from "react";
import axiosInstance from "@/lib/axiosInstance";
import TabWrapper from "@/components/tabWrapper";
import MedicineList from "./MedicineList";
import EditModal from "./EditModal";
import CreateForm from "./CreateForm"; // Imported to satisfy structure

interface MedicineManagerProps {
  baseProps: {
    handleError: (err: any) => void;
    showAlert: (msg: string) => void;
    setDeleteDialog: (config: {
      open: boolean;
      id: number | null;
      type: string;
    }) => void;
    setLoading: (state: boolean) => void;
  };
  refreshTrigger?: number;
}

export default function MedicineManager({
  baseProps,
  refreshTrigger = 0,
}: MedicineManagerProps) {
  const { handleError, showAlert, setDeleteDialog, setLoading } = baseProps;

  // =========================================
  // STATE MANAGEMENT
  // =========================================
  const [medicines, setMedicines] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);
  const [searchId, setSearchId] = useState("");
  const [page, setPage] = useState(1);
  const [editingItem, setEditingItem] = useState<any>(null);

  // =========================================
  // API HANDLERS
  // =========================================
  useEffect(() => {
    axiosInstance
      .get("/api/unitMedicine")
      .then((res) => setUnits(res.data))
      .catch(console.error);
  }, [refreshTrigger]);

  const fetchBySpendingId = async (id: number) => {
    if (!id) return showAlert("Isi Spending ID dulu");
    try {
      setLoading(true);
      const res = await axiosInstance.post(
        "/api/spendingMedicineBySpendingId",
        {
          detail_spending_id: id,
        }
      );
      setMedicines(res.data);
    } catch (e) {
      handleError(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => fetchBySpendingId(Number(searchId));

  const handleUpdate = async (form: any) => {
    if (!editingItem) return;
    try {
      setLoading(true);
      await axiosInstance.put(`/api/detailMedicineSpending/${editingItem.id}`, {
        name_medicine: form.name,
        quantity: Number(form.qty || 0),
        name_unit_id: Number(form.unitId || 0),
        price_per_item: Number(form.price || 0),
      });
      showAlert("✅ Detail obat diupdate");
      setEditingItem(null);
      if (searchId) fetchBySpendingId(Number(searchId));
    } catch (e) {
      handleError(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRequest = (id: number) => {
    setDeleteDialog({ open: true, id, type: "medicine" });
  };

  // =========================================
  // DERIVED STATE
  // =========================================
  const pageCount = Math.max(1, Math.ceil(medicines.length / 10));
  const paginatedData = useMemo(() => {
    const start = (page - 1) * 10;
    return medicines.slice(start, start + 10);
  }, [medicines, page]);

  // =========================================
  // RENDER
  // =========================================
  return (
    <TabWrapper>
      {/* CreateForm is hidden/unused but present for structure */}
      <CreateForm />

      <div className="w-full">
        <MedicineList
          data={paginatedData}
          loading={false}
          page={page}
          setPage={setPage}
          pageCount={pageCount}
          searchId={searchId}
          setSearchId={setSearchId}
          onSearch={handleSearch}
          onRefresh={() => searchId && fetchBySpendingId(Number(searchId))}
          onEdit={setEditingItem}
          onDelete={handleDeleteRequest}
        />
      </div>

      {editingItem && (
        <EditModal
          editing={editingItem}
          units={units}
          onClose={() => setEditingItem(null)}
          onSave={handleUpdate}
        />
      )}
    </TabWrapper>
  );
}
