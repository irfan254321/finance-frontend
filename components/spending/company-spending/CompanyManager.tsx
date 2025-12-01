/**
 * @component CompanyManager
 * @description Smart component (Container) that orchestrates CRUD operations
 * for Spending Companies. It manages the state and logic, while delegating
 * UI rendering to dumb components (CreateForm, CompanyList, EditModal).
 */

"use client";

// =========================================
// IMPORTS
// =========================================
import { useState, useEffect, useCallback, useMemo } from "react";
import axiosInstance from "@/lib/axiosInstance";

// Sub-components (Dumb UI)
import CreateForm from "./CreateForm";
import EditModal from "./EditModal";
import CompanyList from "./CompanyList";
import TabWrapper from "@/components/tabWrapper";

// =========================================
// TYPES & INTERFACES
// =========================================
interface CompanyManagerProps {
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

// Ideally, this should be imported from a global types file
interface Company {
  id: number;
  name_company: string;
}

const ITEMS_PER_PAGE = 15;

export default function CompanyManager({
  baseProps,
  refreshTrigger = 0,
  showCreate = true,
}: CompanyManagerProps) {
  // Destructure base utilities for cleaner access
  const { handleError, showAlert, setDeleteDialog } = baseProps;

  // =========================================
  // STATE MANAGEMENT
  // =========================================

  // Data State: Stores the list of companies from the API
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  // Form State: Manages the input for creating a new company
  const [newName, setNewName] = useState("");

  // UI State: Controls the visibility of the Edit Modal
  const [editingItem, setEditingItem] = useState<Company | null>(null);

  // Pagination & Search State
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");

  // =========================================
  // API HANDLERS (Business Logic)
  // =========================================

  /**
   * Fetches the latest company data from the server.
   * Wrapped in useCallback to prevent unnecessary re-renders.
   */
  const fetchData = useCallback(async () => {
    try {
      setIsFetching(true);
      const res = await axiosInstance.get("/api/CompanyMedicine");
      setCompanies(res.data);
    } catch (error) {
      handleError(error);
    } finally {
      setIsFetching(false);
    }
  }, [handleError]);

  /**
   * Handles the submission of a new company.
   * Validates input, sends POST request, and refreshes the list.
   */
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation: Prevent empty submissions
    if (!newName.trim()) return;

    try {
      // Optional: You can set a local loading state here if needed
      await axiosInstance.post("/api/inputCompanyMedicine", {
        name_company: newName,
      });

      showAlert("✅ Perusahaan berhasil ditambahkan!");
      setNewName("");
      fetchData();
    } catch (error) {
      handleError(error);
    }
  };

  /**
   * Handles the update of an existing company.
   * Called by EditModal.
   */
  const handleUpdate = async (id: number, updatedName: string) => {
    try {
      await axiosInstance.put(`/api/companyMedicine/${id}`, {
        name_company: updatedName,
      });
      showAlert("✅ Perusahaan berhasil diupdate");
      fetchData();
    } catch (error) {
      handleError(error);
      throw error; // Re-throw to let child know it failed
    }
  };

  /**
   * Opens the delete confirmation dialog via parent props.
   */
  const handleDeleteRequest = (id: number) => {
    setDeleteDialog({ open: true, id, type: "company" });
  };

  // =========================================
  // EFFECTS
  // =========================================

  // Initial data load on component mount
  useEffect(() => {
    fetchData();
  }, [fetchData, refreshTrigger]);

  // =========================================
  // DERIVED STATE (Pagination & Search)
  // =========================================

  const filteredData = useMemo(() => {
    return companies.filter((comp) =>
      comp.name_company.toLowerCase().includes(query.toLowerCase())
    );
  }, [companies, query]);

  const pageCount = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredData, page]);

  // Reset page when query changes
  useEffect(() => {
    setPage(1);
  }, [query]);

  // =========================================
  // RENDER
  // =========================================
  return (
    <TabWrapper>
      {/* 1. Creation Section (Input below) - Conditionally Rendered */}
      {showCreate && (
        <CreateForm
          newName={newName}
          setNewName={setNewName}
          onSubmit={handleCreate}
          loading={isFetching}
        />
      )}

      {/* 2. Data Display Section (List View) */}
      <div className="w-full">
        <CompanyList
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

      {/* 3. Modification Section (Conditional) */}
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
