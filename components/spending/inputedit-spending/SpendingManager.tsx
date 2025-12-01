/**
 * @component SpendingManager
 * @description Smart component (Container) that orchestrates CRUD operations
 * for Spending. It manages the state and logic, while delegating
 * UI rendering to dumb components (CreateForm, SpendingList, EditModal).
 */

"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import axiosInstance from "@/lib/axiosInstance";
import TabWrapper from "@/components/tabWrapper";
import CreateForm from "./CreateForm";
import SpendingList from "./SpendingList";
import EditModal from "./EditModal";
import { useSpendingForm } from "@/hooks/spendingInput/useSpendingForm";

interface SpendingManagerProps {
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
  showCreate?: boolean;
}

export default function SpendingManager({
  baseProps,
  refreshTrigger = 0,
  showCreate = true,
}: SpendingManagerProps) {
  const { handleError, showAlert, setDeleteDialog, setLoading } = baseProps;

  // =========================================
  // STATE MANAGEMENT
  // =========================================
  const [spendings, setSpendings] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  // Filter States
  const [query, setQuery] = useState("");
  const [dateQuery, setDateQuery] = useState("");
  const [page, setPage] = useState(1);

  // Edit State
  const [editingItem, setEditingItem] = useState<any>(null);

  // Hook for Create Form
  const spendingForm = useSpendingForm();

  // =========================================
  // API HANDLERS
  // =========================================
  const fetchData = useCallback(async () => {
    try {
      setIsFetching(true);
      const [resSp, resCat] = await Promise.all([
        axiosInstance.get("/api/spending"),
        axiosInstance.get("/api/CategorySpending"),
      ]);
      setSpendings(resSp.data);
      setCategories(resCat.data);
    } catch (error) {
      handleError(error);
    } finally {
      setIsFetching(false);
    }
  }, [handleError]);

  const handleUpdate = async (form: any) => {
    if (!editingItem) return;
    try {
      setLoading(true);
      await axiosInstance.put(`/api/detailSpending/${editingItem.id}`, {
        name_spending: form.name,
        category_id: Number(form.catId),
        date_spending: form.date,
        ...(Number(form.catId) !== 9 && {
          amount_spending: Number(form.amount || 0),
        }),
        ...(Number(form.catId) === 9
          ? { company_id: Number(form.compId || 0) }
          : { company_id: null }),
      });
      showAlert("✅ Spending diupdate");
      setEditingItem(null);
      fetchData();
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRequest = (id: number) => {
    setDeleteDialog({ open: true, id, type: "spending" });
  };

  // =========================================
  // EFFECTS
  // =========================================
  useEffect(() => {
    fetchData();
  }, [fetchData, refreshTrigger]);

  // Sync alerts from hook to parent
  useEffect(() => {
    if (spendingForm.alert.open) {
      if (spendingForm.alert.severity === "error") {
        // Assuming baseProps.showAlert handles errors appropriately or just shows message
        // Ideally we should use handleError but it expects an error object usually
        // Let's just use showAlert for simplicity as per previous pattern
        showAlert(spendingForm.alert.message);
      } else {
        showAlert(spendingForm.alert.message);
      }
      spendingForm.setAlert((prev) => ({ ...prev, open: false }));
    }
  }, [spendingForm.alert, showAlert, spendingForm.setAlert]);

  // =========================================
  // DERIVED STATE
  // =========================================
  const filteredData = useMemo(() => {
    return spendings
      .filter(
        (s) =>
          `${s.name_spending} ${s.category_id} ${s.company_id ?? ""}`
            .toLowerCase()
            .includes(query.toLowerCase()) &&
          (dateQuery ? s.date_spending.includes(dateQuery) : true)
      )
      .sort((a, b) => a.id - b.id);
  }, [spendings, query, dateQuery]);

  const pageCount = Math.max(1, Math.ceil(filteredData.length / 10));
  const paginatedData = useMemo(() => {
    const start = (page - 1) * 10;
    return filteredData.slice(start, start + 10);
  }, [filteredData, page]);

  // =========================================
  // RENDER
  // =========================================
  return (
    <TabWrapper>
      {showCreate && (
        <>
          <h2 className="text-[#FFD700] text-2xl font-bold mb-6 tracking-wide">
            Input Data Pengeluaran
          </h2>
          <CreateForm
            form={spendingForm.form}
            handleChange={spendingForm.handleChange}
            handleSubmitSpending={spendingForm.handleSubmitSpending}
            categories={spendingForm.categories}
            medicines={spendingForm.medicines}
            handleMedicineChange={spendingForm.handleMedicineChange}
            addMedicine={spendingForm.addMedicine}
            removeMedicine={spendingForm.removeMedicine}
            totalObat={spendingForm.totalObat}
            loading={spendingForm.loading}
          />
        </>
      )}

      {!showCreate && (
        <div className="w-full">
          <SpendingList
            data={paginatedData}
            loading={isFetching}
            page={page}
            setPage={setPage}
            pageCount={pageCount}
            query={query}
            setQuery={setQuery}
            dateQuery={dateQuery}
            setDateQuery={setDateQuery}
            onRefresh={fetchData}
            onEdit={setEditingItem}
            onDelete={handleDeleteRequest}
          />
        </div>
      )}

      {editingItem && (
        <EditModal
          editing={editingItem}
          categories={categories}
          onClose={() => setEditingItem(null)}
          onSave={handleUpdate}
        />
      )}
    </TabWrapper>
  );
}
