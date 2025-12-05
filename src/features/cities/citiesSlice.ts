// src/features/cities/citiesSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchCitiesApi } from "../../lib/apiClient";
import type { CitiesResponse, City } from "../../types/api";

export interface CitiesState {
  items: City[];
  loading: boolean;
  error: string | null;
  selectedCityId: string | null;
}

const initialState: CitiesState = {
  items: [],
  loading: false,
  error: null,
  selectedCityId: null,
};

export const fetchCities = createAsyncThunk<CitiesResponse>(
  "cities/fetchCities",
  async () => {
    const res = await fetchCitiesApi();
    return res.data as CitiesResponse;
  }
);

const citiesSlice = createSlice({
  name: "cities",
  initialState,
  reducers: {
    setSelectedCity(state, action) {
      state.selectedCityId = action.payload as string;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCities.fulfilled, (state, action) => {
        state.loading = false;
        const cities = action.payload.data || [];
        state.items = cities;
        if (!state.selectedCityId && cities.length > 0) {
          state.selectedCityId = cities[0].city_id;
        }
      })
      .addCase(fetchCities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load cities";
      });
  },
});

export const { setSelectedCity } = citiesSlice.actions;
export default citiesSlice.reducer;
