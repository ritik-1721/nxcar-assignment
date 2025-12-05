// src/features/cars/carsSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchCarsApi } from "../../lib/apiClient";
import type {
  CarsResponse,
  Car,
  FilterPriceGroup,
  FilterMakeOption,
  FilterRangeRaw,
  FilterMakeRaw,
  FilterRaw,
} from "../../types/api";
import type { RootState } from "../../lib/store";

const DEFAULT_YEAR = { min: 2010, max: 2025 };
const DEFAULT_PRICE = { min: 90000, max: 3600000 };

interface RangeFilterMeta {
  displayName: string;
  name: string;
  type: "range";
  selected_min: number;
  selected_max: number;
  min: number;
  max: number;
  count: number | string;
  groups?: FilterPriceGroup[];
}

interface CarsFiltersMeta {
  price: RangeFilterMeta | null;
  year: RangeFilterMeta | null;
  makes: FilterMakeOption[];
}

export interface AppliedFilters {
  year: { min: number; max: number };
  price: { min: number; max: number };
  make: string[]; // make names
  model: string[]; // model names
}

export interface CarsState {
  items: Car[];
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  filtersMeta: CarsFiltersMeta | null;
  appliedFilters: AppliedFilters;
  noDataMessage: string | null;
}

const initialState: CarsState = {
  items: [],
  loading: false,
  error: null,
  page: 1,
  totalPages: 1,
  filtersMeta: null,
  appliedFilters: {
    year: { min: DEFAULT_YEAR.min, max: DEFAULT_YEAR.max },
    price: { min: DEFAULT_PRICE.min, max: DEFAULT_PRICE.max },
    make: [],
    model: [],
  },
  noDataMessage: null,
};

export const fetchCars = createAsyncThunk<
  CarsResponse,
  { append?: boolean } | undefined,
  { state: RootState }
>("cars/fetchCars", async (_arg, { getState }) => {
  const state = getState();
  const { page, appliedFilters } = state.cars;
  const { selectedCityId } = state.cities;

  const payload = {
    page,
    fltr: [
      {
        type: "range",
        name: "year",
        selected_min: appliedFilters.year.min,
        selected_max: appliedFilters.year.max,
        min: DEFAULT_YEAR.min,
        max: DEFAULT_YEAR.max,
      },
      {
        type: "range",
        name: "price",
        selected_min: appliedFilters.price.min,
        selected_max: appliedFilters.price.max,
        min: DEFAULT_PRICE.min,
        max: DEFAULT_PRICE.max,
      },
      {
        type: "multiselect",
        name: "make",
        options: appliedFilters.make,
      },
      {
        type: "multiselect",
        name: "model",
        options: appliedFilters.model,
      },
      {
        city_id: selectedCityId,
      },
    ],
    sort: null,
    sort_by: null,
  };

  const res = await fetchCarsApi(payload);
  return res.data as CarsResponse;
});

const carsSlice = createSlice({
  name: "cars",
  initialState,
  reducers: {
    setPage(state, action) {
      state.page = action.payload as number;
    },
    setYearFilter(state, action) {
      state.appliedFilters.year = action.payload as AppliedFilters["year"];
      state.page = 1;
    },
    setPriceFilter(state, action) {
      state.appliedFilters.price = action.payload as AppliedFilters["price"];
      state.page = 1;
    },
    setMakeFilter(state, action) {
      state.appliedFilters.make = action.payload as string[];
      // reset models when make changes
      state.appliedFilters.model = [];
      state.page = 1;
    },
    setModelFilter(state, action) {
      state.appliedFilters.model = action.payload as string[];
      state.page = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCars.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCars.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload;
        const append = action.meta.arg?.append ?? false;

        // allcars can be array OR string ("No Data to Shows")
        if (typeof data.allcars === "string") {
          if (!append) {
            state.items = [];
            state.noDataMessage = data.allcars;
          }
        } else {
          const newCars = data.allcars || [];
          state.noDataMessage = null;
          state.items = append
            ? [...state.items, ...newCars]
            : newCars;
        }

        state.totalPages = data.pagination?.total_pages || 1;

        const filtersArray: FilterRaw[] = data.filters || [];
        const filtersMeta: CarsFiltersMeta = {
          price: null,
          year: null,
          makes: [],
        };

        filtersArray.forEach((f) => {
          if (f.type === "range") {
            const r = f as FilterRangeRaw;
            const obj: RangeFilterMeta = {
              ...r,
              selected_min: Number(r.selected_min),
              selected_max: Number(r.selected_max),
              min: Number(r.min),
              max: Number(r.max),
            };
            if (r.name === "price") {
              filtersMeta.price = obj;
            } else if (r.name === "year") {
              filtersMeta.year = obj;
            }
          } else if (f.type === "multiselect") {
            const m = f as FilterMakeRaw;
            filtersMeta.makes = m.options || [];
          }
        });

        state.filtersMeta = filtersMeta;
      })
      .addCase(fetchCars.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load cars";
      });
  },
});

export const {
  setPage,
  setYearFilter,
  setPriceFilter,
  setMakeFilter,
  setModelFilter,
} = carsSlice.actions;

export default carsSlice.reducer;
