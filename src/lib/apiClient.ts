// src/lib/apiClient.ts
import axios from "axios";

export const apiClient = axios.create({
  baseURL: "https://crm-dev.nxcar.in/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Cities API
export const fetchCitiesApi = () => apiClient.get("/test-avail-cities");

// Cars list API
export interface CarsListPayload {
  page: number;
  fltr: any[];
  sort: null | string;
  sort_by: null | string;
}

export const fetchCarsApi = (payload: CarsListPayload) =>
  apiClient.post("/test-cars-list", payload);
