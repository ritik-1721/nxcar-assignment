// src/components/FiltersPanel.tsx
"use client";

import React, { useEffect, useState } from "react";
import {
  fetchCars,
  setPriceFilter,
  setYearFilter,
  setPage,
} from "../features/cars/carsSlice";
import { useAppDispatch, useAppSelector } from "../lib/hooks";
import MakeModelFilter from "./MakeModelFilter";

export default function FiltersPanel() {
  const dispatch = useAppDispatch();
  const { filtersMeta, appliedFilters } = useAppSelector(
    (state) => state.cars
  );

  const priceMeta = filtersMeta?.price;
  const yearMeta = filtersMeta?.year;

  const [yearMin, setYearMin] = useState<number>(appliedFilters.year.min);
  const [yearMax, setYearMax] = useState<number>(appliedFilters.year.max);
  const [priceMin, setPriceMin] = useState<number>(appliedFilters.price.min);
  const [priceMax, setPriceMax] = useState<number>(appliedFilters.price.max);

  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const [isYearOpen, setIsYearOpen] = useState(false);

  useEffect(() => {
    if (yearMeta) {
      setYearMin(yearMeta.selected_min);
      setYearMax(yearMeta.selected_max);
    }
  }, [yearMeta]);

  useEffect(() => {
    if (priceMeta) {
      setPriceMin(priceMeta.selected_min);
      setPriceMax(priceMeta.selected_max);
    }
  }, [priceMeta]);

  const triggerSearch = () => {
    dispatch(setPage(1));
    dispatch(fetchCars({ append: false }));
  };

  const updateYear = (min: number, max: number) => {
    setYearMin(min);
    setYearMax(max);
    dispatch(
      setYearFilter({
        min,
        max,
      })
    );
    triggerSearch();
  };

  const updatePrice = (min: number, max: number) => {
    setPriceMin(min);
    setPriceMax(max);
    dispatch(
      setPriceFilter({
        min,
        max,
      })
    );
    triggerSearch();
  };

  return (
    <aside className="w-full md:w-64 border-r border-gray-200 p-4 space-y-3 bg-[#F7FAF8]">
      {/* Price Range accordion */}
      <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-3">
        <button
          type="button"
          onClick={() => setIsPriceOpen((v) => !v)}
          className="w-full flex items-center justify-between"
        >
          <span className="text-sm font-medium">Price Range</span>
          <span className="text-lg text-gray-400">
            {isPriceOpen ? "−" : "+"}
          </span>
        </button>

        {isPriceOpen && (
          <div className="mt-3 space-y-3">
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>₹ {priceMin.toLocaleString("en-IN")}</span>
              <span>₹ {priceMax.toLocaleString("en-IN")}</span>
            </div>

            <div className="flex gap-2 items-center">
              <input
                type="number"
                className="border rounded px-2 py-1 w-1/2 text-sm"
                value={priceMin}
                onChange={(e) =>
                  updatePrice(Number(e.target.value) || priceMin, priceMax)
                }
              />
              <span className="text-xs text-gray-500">to</span>
              <input
                type="number"
                className="border rounded px-2 py-1 w-1/2 text-sm"
                value={priceMax}
                onChange={(e) =>
                  updatePrice(priceMin, Number(e.target.value) || priceMax)
                }
              />
            </div>

            {priceMeta?.groups && (
              <div className="mt-2 space-y-1">
                {priceMeta.groups.map((g) => (
                  <label
                    key={g.name}
                    className="flex items-center justify-between text-sm cursor-pointer"
                    onClick={() =>
                      updatePrice(
                        g.min,
                        g.max ?? priceMeta.max ?? priceMax
                      )
                    }
                  >
                    <div className="flex items-center gap-2">
                      <input type="radio" name="priceGroup" readOnly />
                      <span>{g.displayName}</span>
                    </div>
                    <span className="text-[11px] text-gray-500">
                      {g.count}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Make + Model combined filter */}
      <MakeModelFilter />

      {/* Make Year accordion */}
      <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-3">
        <button
          type="button"
          onClick={() => setIsYearOpen((v) => !v)}
          className="w-full flex items-center justify-between"
        >
          <span className="text-sm font-medium">Make Year</span>
          <span className="text-lg text-gray-400">
            {isYearOpen ? "−" : "+"}
          </span>
        </button>

        {isYearOpen && (
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>{yearMin}</span>
              <span>{yearMax}</span>
            </div>

            <div className="flex gap-2 items-center">
              <input
                type="number"
                className="border rounded px-2 py-1 w-1/2 text-sm"
                value={yearMin}
                onChange={(e) =>
                  updateYear(Number(e.target.value) || yearMin, yearMax)
                }
              />
              <span className="text-xs text-gray-500">to</span>
              <input
                type="number"
                className="border rounded px-2 py-1 w-1/2 text-sm"
                value={yearMax}
                onChange={(e) =>
                  updateYear(yearMin, Number(e.target.value) || yearMax)
                }
              />
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
