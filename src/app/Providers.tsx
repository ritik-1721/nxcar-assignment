// src/app/Providers.tsx
"use client";

import { Provider } from "react-redux";
import { makeStore } from "../lib/store";

const store = makeStore();

interface ReduxProviderProps {
  children: React.ReactNode;
}

export function ReduxProvider({ children }: ReduxProviderProps) {
  return <Provider store={store}>{children}</Provider>;
}
