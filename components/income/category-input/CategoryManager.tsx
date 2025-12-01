/**
 * @component CategoryManager
 * @description Smart component (Container) that orchestrates CRUD operations
 * for Category Income. It manages the state and logic, while delegating
 * UI rendering to dumb components (CreateForm, CategoryList, EditModal).
 */

"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import axiosInstance from "@/lib/axiosInstance";
import TabWrapper from "@/components/tabWrapper";
import CreateForm from "./CreateForm";
import CategoryList from "./CategoryList";
import EditModal from "./EditModal";

interface CategoryManagerProps {
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

export default function CategoryManager({
  baseProps,
  refreshTrigger = 0,
  showCreate = true,
}: CategoryManagerProps) {
  const { handleError, showAlert, setDeleteDialog, setLoading } = baseProps;

  // =========================================
  // STATE MANAGEMENT
  // =========================================
  const [categories, setCategories] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [editingItem, setEditingItem] = useState<any>(null);

  // Filter States
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  // =========================================
  // API HANDLERS
  // =========================================
  const fetchData = useCallback(async () => {
    try {
      setIsFetching(true);
      const res = await axiosInstance.get("/api/categoryIncome");
      setCategories(res.data);
    } catch (error) {
      handleError(error);
    } finally {
      setIsFetching(false);
    }
  }, [handleError]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    try {
      setLoading(true);
      await axiosInstance.post("/api/inputCategoryIncome", {
        name_category: categoryName,
      });
      showAlert("✅ Kategori berhasil ditambahkan!");
      setCategoryName("");
      fetchData();
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: number, name: string) => {
    try {
      setLoading(true);
      await axiosInstance.put(`/api/categoryIncome/${id}`, {
        name_category: name,
      });
      showAlert("✅ Kategori berhasil diupdate");
      setEditingItem(null);
      fetchData();
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRequest = (id: number) => {
    setDeleteDialog({ open: true, id, type: "category" });
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
    return categories.filter((c) =>
      c.name_category.toLowerCase().includes(query.toLowerCase())
    );
  }, [categories, query]);

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
        <CreateForm
          categoryName={categoryName}
          setCategoryName={setCategoryName}
          handleSubmitCategory={handleCreate}
          loading={false} // Loading handled by parent via baseProps.setLoading usually, but here we can pass local loading if needed.
        />
      )}

      <div className="w-full">
        <CategoryList
          categories={showCreate ? categories : paginatedData} // Show all in input mode (card view), paginated in edit mode (table view)
          loading={isFetching}
          page={page}
          setPage={setPage}
          pageCount={pageCount}
          query={query}
          setQuery={setQuery}
          onRefresh={fetchData}
          onEdit={setEditingItem}
          onDelete={handleDeleteRequest}
          isEditMode={!showCreate}
        />
      </div>

      {editingItem && (
        <EditModal
          editing={editingItem}
          onClose={() => setEditingItem(null)}
          onSave={handleUpdate}
        />
      )}
    </TabWrapper>
  );
}
