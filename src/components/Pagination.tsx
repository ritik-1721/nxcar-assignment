// src/components/Pagination.tsx
"use client";

import { fetchCars, setPage } from "../features/cars/carsSlice";
import { useAppDispatch, useAppSelector } from "../lib/hooks";

export default function Pagination() {
  const dispatch = useAppDispatch();
  const { page, totalPages } = useAppSelector((state) => state.cars);

  if (totalPages <= 1) return null;

  const goToPage = (p: number) => {
    if (p < 1 || p > totalPages) return;
    dispatch(setPage(p));
    dispatch(fetchCars());
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        className="px-3 py-1 text-sm border rounded disabled:opacity-50"
        disabled={page === 1}
        onClick={() => goToPage(page - 1)}
      >
        Prev
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => goToPage(p)}
          className={`px-3 py-1 text-sm border rounded ${
            p === page
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-700"
          }`}
        >
          {p}
        </button>
      ))}

      <button
        className="px-3 py-1 text-sm border rounded disabled:opacity-50"
        disabled={page === totalPages}
        onClick={() => goToPage(page + 1)}
      >
        Next
      </button>
    </div>
  );
}
