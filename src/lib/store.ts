// src/lib/store.ts
import { configureStore } from "@reduxjs/toolkit";
import citiesReducer from "../features/cities/citiesSlice";
import carsReducer from "../features/cars/carsSlice";

export const makeStore = () =>
  configureStore({
    reducer: {
      cities: citiesReducer,
      cars: carsReducer,
    },
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
