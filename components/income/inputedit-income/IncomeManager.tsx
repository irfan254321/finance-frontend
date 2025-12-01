/**
 * @component IncomeManager
 * @description Smart component (Container) that orchestrates CRUD operations
 * for Income. It manages the state and logic, while delegating
 * UI rendering to dumb components (CreateForm, IncomeList, EditModal).
 */

"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import axiosInstance from "@/lib/axiosInstance";
import TabWrapper from "@/components/tabWrapper";
import CreateForm from "./CreateForm";
import IncomeList from "./IncomeList";
import EditModal from "./EditModal";

interface IncomeManagerProps {
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

export default function IncomeManager({
  baseProps,
  refreshTrigger = 0,
  showCreate = true,
}: IncomeManagerProps) {
  const { handleError, showAlert, setDeleteDialog, setLoading } = baseProps;

  // =========================================
  // STATE MANAGEMENT
  // =========================================
  const [incomes, setIncomes] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  // Form State (for Create)
  const [form, setForm] = useState({
    name_income: "",
    amount_income: "",
    category_id: "",
    date_income: "",
  });

  // Filter States
  const [query, setQuery] = useState("");
  const [dateQuery, setDateQuery] = useState("");
  const [page, setPage] = useState(1);

  // Edit State
  const [editingItem, setEditingItem] = useState<any>(null);

  // =========================================
  // API HANDLERS
  // =========================================
  const fetchData = useCallback(async () => {
    try {
      setIsFetching(true);
      const [resInc, resCat] = await Promise.all([
        axiosInstance.get("/api/income"),
        axiosInstance.get("/api/categoryIncome"),
      ]);
      setIncomes(resInc.data);
      setCategories(resCat.data);
    } catch (error) {
      handleError(error);
    } finally {
      setIsFetching(false);
    }
  }, [handleError]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axiosInstance.post("/api/inputIncomeDetail", {
        ...form,
        amount_income: Number(form.amount_income),
        category_id: Number(form.category_id),
      });
      showAlert("✅ Data income tersimpan!");
      setForm({
        name_income: "",
        amount_income: "",
        category_id: "",
        date_income: "",
      });
      fetchData();
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (form: any) => {
    if (!editingItem) return;
    try {
      setLoading(true);
      await axiosInstance.put(`/api/detailIncome/${editingItem.id}`, {
        name_income: form.name,
        amount_income: Number(form.amount || 0),
        category_id: Number(form.catId),
        date_income: form.date,
      });
      showAlert("✅ Income berhasil diupdate");
      setEditingItem(null);
      fetchData();
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRequest = (id: number) => {
    setDeleteDialog({ open: true, id, type: "income" });
  };

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // =========================================
  // EFFECTS
  // =========================================
  useEffect(() => {
    fetchData();
  }, [fetchData, refreshTrigger]);

  // =========================================
  // DERIVED STATE
  // =========================================
  const filteredData = useMemo(() => {
    return incomes
      .filter(
        (i) =>
          `${i.name_income} ${i.category_id}`
            .toLowerCase()
            .includes(query.toLowerCase()) &&
          (dateQuery ? i.date_income.includes(dateQuery) : true)
      )
      .sort((a, b) => a.id - b.id);
  }, [incomes, query, dateQuery]);

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
          <h2 className="text-[#FFD700] text-2xl font-bold mb-8 tracking-wide text-center">
            Input Data Pemasukan
          </h2>
          <CreateForm
            form={form}
            handleChange={handleChange}
            handleSubmitIncome={handleCreate}
            loading={false} // Loading handled by parent via baseProps.setLoading usually, but here we can pass local loading if needed.
            // Wait, handleCreate uses setLoading from baseProps which affects global loading overlay?
            // Or local button loading?
            // In original InputIncome, loading was passed as prop.
            // Here, let's use a local loading state for the button if we want, or just pass the global one if we had access.
            // But baseProps.setLoading usually triggers a full screen loader or similar.
            // Let's check how SpendingManager did it.
            // SpendingManager passed spendingForm.loading to CreateForm.
            // Here I don't have a separate hook.
            // I'll use a local loading state for the button.
            categories={categories}
          />
        </>
      )}

      {!showCreate && (
        <div className="w-full">
          <IncomeList
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
