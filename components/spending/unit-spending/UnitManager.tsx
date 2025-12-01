/**
 * @component UnitManager
 * @description Smart component (Container) that orchestrates CRUD operations
 * for Units. It manages the state and logic, while delegating
 * UI rendering to dumb components (CreateForm, UnitList, EditModal).
 */

"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import axiosInstance from "@/lib/axiosInstance";
import TabWrapper from "@/components/tabWrapper";
import CreateForm from "./CreateForm";
import UnitList from "./UnitList";
import EditModal from "./EditModal";

interface UnitManagerProps {
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

interface Unit {
  id: number;
  name_unit: string;
}

const ITEMS_PER_PAGE = 15;

export default function UnitManager({
  baseProps,
  refreshTrigger = 0,
  showCreate = true,
}: UnitManagerProps) {
  const { handleError, showAlert, setDeleteDialog } = baseProps;

  // =========================================
  // STATE MANAGEMENT
  // =========================================
  const [units, setUnits] = useState<Unit[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [newName, setNewName] = useState("");
  const [editingItem, setEditingItem] = useState<Unit | null>(null);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");

  // =========================================
  // API HANDLERS
  // =========================================
  const fetchData = useCallback(async () => {
    try {
      setIsFetching(true);
      const res = await axiosInstance.get("/api/unitMedicine");
      setUnits(res.data);
    } catch (error) {
      handleError(error);
    } finally {
      setIsFetching(false);
    }
  }, [handleError]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    try {
      await axiosInstance.post("/api/unitMedicine", {
        name_unit: newName,
      });
      showAlert("✅ Unit berhasil ditambahkan!");
      setNewName("");
      fetchData();
    } catch (error) {
      handleError(error);
    }
  };

  const handleUpdate = async (id: number, updatedName: string) => {
    try {
      await axiosInstance.put(`/api/unitMedicine/${id}`, {
        name_unit: updatedName,
      });
      showAlert("✅ Unit berhasil diupdate");
      fetchData();
    } catch (error) {
      handleError(error);
      throw error;
    }
  };

  const handleDeleteRequest = (id: number) => {
    setDeleteDialog({ open: true, id, type: "unit" });
  };

  // =========================================
  // EFFECTS
  // =========================================
  useEffect(() => {
    fetchData();
  }, [fetchData, refreshTrigger]);

  useEffect(() => {
    setPage(1);
  }, [query]);

  // =========================================
  // DERIVED STATE
  // =========================================
  const filteredData = useMemo(() => {
    return units.filter((u) =>
      u.name_unit.toLowerCase().includes(query.toLowerCase())
    );
  }, [units, query]);

  const pageCount = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredData, page]);

  // =========================================
  // RENDER
  // =========================================
  return (
    <TabWrapper>
      {showCreate && (
        <CreateForm
          newName={newName}
          setNewName={setNewName}
          onSubmit={handleCreate}
          loading={isFetching}
        />
      )}

      <div className="w-full">
        <UnitList
          data={paginatedData}
          loading={isFetching}
          page={page}
          setPage={setPage}
          pageCount={pageCount}
          query={query}
          setQuery={setQuery}
          onEdit={setEditingItem}
          onDelete={handleDeleteRequest}
          onRefresh={fetchData}
        />
      </div>

      {editingItem && (
        <EditModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSubmit={handleUpdate}
        />
      )}
    </TabWrapper>
  );
}
