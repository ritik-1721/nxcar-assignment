// src/app/page.tsx
"use client";

import { useEffect } from "react";
import {
  useRouter,
  usePathname,
  useSearchParams,
} from "next/navigation";

import { fetchCities } from "../features/cities/citiesSlice";
import {
  fetchCars,
  setPage,
  type AppliedFilters,
} from "../features/cars/carsSlice";

import { useAppDispatch, useAppSelector } from "../lib/hooks";
import TopBar from "../components/TopBar";
import FiltersPanel from "../components/FiltersPanel";
import CarCard from "../components/CarCard";

// slug helpers
const toSlug = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .replace(/[\s/]+/g, "_")
    .replace(/[^a-z0-9_]+/g, "")
    .replace(/^_+|_+$/g, "");

const buildFiltersSlug = (opts: {
  filters: AppliedFilters;
  cityName?: string;
}): string => {
  const { filters, cityName } = opts;
  const parts: string[] = [];

  parts.push("used");

  if (filters.make.length > 0) {
    const makePart = filters.make.map(toSlug).join("-");
    parts.push(makePart);
  }

  if (filters.model.length > 0) {
    const modelPart =
      "model-" + filters.model.map(toSlug).join("-");
    parts.push(modelPart);
  }

  parts.push("cars");

  parts.push(`from-${filters.year.min}-to-${filters.year.max}`);

  const lakh = (n: number) => n / 100000;
  const fromLakh = lakh(filters.price.min);
  const toLakh = lakh(filters.price.max);
  const fromStr = fromLakh.toFixed(5);
  const toStr = toLakh.toFixed(0);

  parts.push(`between-${fromStr}-lakh`);
  parts.push(`to-${toStr}-lakh`);

  if (cityName) {
    parts.push("in");
    parts.push(
      cityName.trim().toLowerCase().replace(/\s+/g, "-")
    );
  }

  return parts.join("+");
};

export default function HomePage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const carsState = useAppSelector((state) => state.cars);
  const {
    items: cars,
    loading,
    error,
    noDataMessage,
    appliedFilters,
    page,
    totalPages,
  } = carsState;

  const citiesState = useAppSelector((state) => state.cities);
  const { selectedCityId, items: cities } = citiesState;

  // initial cities
  useEffect(() => {
    dispatch(fetchCities());
  }, [dispatch]);

  // load cars whenever city changes
  useEffect(() => {
    if (selectedCityId) {
      dispatch(fetchCars({ append: false }));
    }
  }, [dispatch, selectedCityId]);

  // infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (loading) return;
      if (page >= totalPages) return;

      const scrollPos =
        window.innerHeight + window.scrollY;
      const threshold =
        document.documentElement.scrollHeight - 400;

      if (scrollPos >= threshold) {
        dispatch(setPage(page + 1));
        dispatch(fetchCars({ append: true }));
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [dispatch, loading, page, totalPages]);

  // sync filters + city + page into URL
  useEffect(() => {
    if (!selectedCityId || !cities.length) return;

    const city = cities.find((c) => c.city_id === selectedCityId);
    const slug = buildFiltersSlug({
      filters: appliedFilters,
      cityName: city?.city_name,
    });

    const currentParams = new URLSearchParams(
      searchParams.toString()
    );
    currentParams.set("filters", slug);
    currentParams.set("city", selectedCityId);
    currentParams.set("page", String(page));

    const nextUrl = `${pathname}?${currentParams.toString()}`;
    const currentUrl = `${pathname}?${searchParams.toString()}`;

    if (nextUrl !== currentUrl) {
      router.replace(nextUrl, { scroll: false });
    }
  }, [
    appliedFilters,
    page,
    selectedCityId,
    cities,
    pathname,
    router,
    searchParams,
  ]);
// className="max-w-6xl mx-auto px-4"
  return (
    <main className="min-h-screen bg-gray-50">
      <div >
        <TopBar />

        <div className="flex flex-col md:flex-row mt-4 gap-4">
          <FiltersPanel />

          <section className="flex-1">
            {loading && page === 1 && (
              <p className="text-sm text-gray-500 mb-4">
                Loading cars...
              </p>
            )}
            {error && (
              <p className="text-sm text-red-600 mb-4">
                Failed to load cars: {error}
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cars && cars.length > 0 ? (
                cars.map((car) => <CarCard key={car.vehicle_id} car={car} />)
              ) : !loading ? (
                <p className="text-sm text-gray-500">
                  {noDataMessage || "No cars found for the selected filters."}
                </p>
              ) : null}
            </div>

            {loading && page > 1 && (
              <p className="text-center text-xs text-gray-400 my-4">
                Loading more cars...
              </p>
            )}

            {page >= totalPages && cars.length > 0 && (
              <p className="text-center text-xs text-gray-400 my-4">
                You&apos;ve reached the end of the list.
              </p>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
