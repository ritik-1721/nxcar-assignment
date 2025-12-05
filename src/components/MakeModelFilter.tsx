// src/components/MakeModelFilter.tsx
"use client";

import React, { useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../lib/hooks";
import {
  fetchCars,
  setMakeFilter,
  setModelFilter,
  setPage,
} from "../features/cars/carsSlice";
import type { FilterMakeOption, FilterModelOption } from "../types/api";

const POPULAR_BRANDS_COUNT = 5;

export default function MakeModelFilter() {
  const dispatch = useAppDispatch();
  const { filtersMeta, appliedFilters } = useAppSelector(
    (state) => state.cars
  );

  const makesMeta: FilterMakeOption[] = filtersMeta?.makes || [];

  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState<string>("");

  // which brand accordions are expanded (by make_id)
  const [expandedBrands, setExpandedBrands] = useState<string[]>([]);

  const selectedMakes = appliedFilters.make;
  const selectedModels = appliedFilters.model;

  const sortedByCount = useMemo(
    () =>
      [...makesMeta].sort((a, b) => {
        const ca = Number(a.count) || 0;
        const cb = Number(b.count) || 0;
        return cb - ca;
      }),
    [makesMeta]
  );

  const popularBrands: FilterMakeOption[] = sortedByCount.slice(
    0,
    POPULAR_BRANDS_COUNT
  );

  const popularIds = new Set(popularBrands.map((b) => b.make_id));
  const otherBrands: FilterMakeOption[] = makesMeta.filter(
    (m) => !popularIds.has(m.make_id)
  );

  const filterModelsBySearch = (
    models: FilterModelOption[]
  ): FilterModelOption[] => {
    if (!search.trim()) return models;
    const term = search.trim().toLowerCase();
    return models.filter((mdl) =>
      mdl.model.toLowerCase().includes(term)
    );
  };

  const triggerSearch = () => {
    dispatch(setPage(1));
    dispatch(fetchCars({ append: false }));
  };

  const toggleBrandExpand = (brandId: string) => {
    setExpandedBrands((prev) =>
      prev.includes(brandId)
        ? prev.filter((id) => id !== brandId)
        : [...prev, brandId]
    );
  };

  const toggleBrandSelect = (brand: FilterMakeOption) => {
    const isSelected = selectedMakes.includes(brand.make);
    let newMakes: string[];
    let newModels = selectedModels;

    if (isSelected) {
      newMakes = selectedMakes.filter((m) => m !== brand.make);
      const brandModelNames = new Set(
        (brand.models || []).map((m) => m.model)
      );
      newModels = selectedModels.filter(
        (m) => !brandModelNames.has(m)
      );
    } else {
      newMakes = [...selectedMakes, brand.make];
    }

    dispatch(setMakeFilter(newMakes));
    dispatch(setModelFilter(newModels));
    triggerSearch();
  };

  const toggleModel = (
    brand: FilterMakeOption,
    mdl: FilterModelOption
  ) => {
    let newModels: string[];
    if (selectedModels.includes(mdl.model)) {
      newModels = selectedModels.filter((m) => m !== mdl.model);
    } else {
      newModels = [...selectedModels, mdl.model];
    }

    let newMakes = selectedMakes;
    if (!selectedMakes.includes(brand.make)) {
      newMakes = [...selectedMakes, brand.make];
    }

    dispatch(setMakeFilter(newMakes));
    dispatch(setModelFilter(newModels));
    triggerSearch();
  };

  const handleClear = () => {
    dispatch(setMakeFilter([]));
    dispatch(setModelFilter([]));
    triggerSearch();
  };

  const renderBrandBlock = (brand: FilterMakeOption) => {
    const brandChecked = selectedMakes.includes(brand.make);
    const isExpanded = expandedBrands.includes(brand.make_id);
    const models = filterModelsBySearch(brand.models || []);

    return (
      <div key={brand.make_id} className="mb-3">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={brandChecked}
              onChange={() => toggleBrandSelect(brand)}
            />
            <span className="font-medium">{brand.make}</span>
          </label>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-gray-500">
              {brand.count}
            </span>
            <button
              type="button"
              onClick={() => toggleBrandExpand(brand.make_id)}
              className="text-xs text-gray-500"
            >
              {isExpanded ? "▾" : "▸"}
            </button>
          </div>
        </div>

        {isExpanded && models.length > 0 && (
          <div className="mt-2 ml-5 space-y-1">
            {models.map((mdl) => {
              const checked = selectedModels.includes(mdl.model);
              return (
                <label
                  key={mdl.model_id}
                  className="flex items-center justify-between gap-2 text-sm cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleModel(brand, mdl)}
                    />
                    <span>{mdl.model}</span>
                  </div>
                  <span className="text-[11px] text-gray-500">
                    {mdl.count}
                  </span>
                </label>
            );
            })}
          </div>
        )}
      </div>
    );
  };

  // collapsed pill
  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white rounded-xl shadow-sm mb-3 border border-gray-100"
      >
        <span className="text-sm font-medium">Make + Model</span>
        <span className="text-lg text-gray-400">+</span>
      </button>
    );
  }

  // expanded card
  return (
    <div className="w-full bg-white rounded-xl shadow-sm mb-3 border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium">Make + Model</span>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="text-lg text-gray-400 leading-none"
        >
          −
        </button>
      </div>

      {/* Search */}
      <div className="mb-3">
        <div className="flex items-center border border-gray-200 rounded-full px-3 py-1.5 bg-gray-50">
          <input
            type="text"
            placeholder="Search your model"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none"
          />
          <span className="text-gray-400 text-sm">🔍</span>
        </div>
      </div>

      <div className="max-h-72 overflow-y-auto pr-1">
        {popularBrands.length > 0 && (
          <div className="mb-4">
            <h4 className="text-xs font-semibold text-gray-500 mb-2">
              Popular
            </h4>
            {popularBrands.map(renderBrandBlock)}
          </div>
        )}

        {otherBrands.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-gray-500 mb-2">
              All Brands
            </h4>
            {otherBrands.map(renderBrandBlock)}
          </div>
        )}
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={handleClear}
          className="text-xs px-3 py-1.5 rounded border border-gray-300 text-gray-700"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
