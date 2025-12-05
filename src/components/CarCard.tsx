"use client";

import { Copy, Heart, MapPin } from "lucide-react";
import type { Car } from "../types/api";

interface CarCardProps {
  car: Car;
}

const formatMoney = (val: string | number | null | undefined): string => {
  if (val == null) return "";
  const num = typeof val === "string" ? Number(val) : val;
  if (Number.isNaN(num)) return String(val);
  return num.toLocaleString("en-IN");
};


export default function CarCard({ car }: CarCardProps) {
  const title = `${car.year} ${car.make} ${car.model} ${car.variant}`.trim();

  const price = car.price;
  const kms = car.mileage;
  const fuel = car.car_additional_fuel || car.fuel_type;
  const transmission = car.transmission || "Manual";
  const location = car.city_name;
  const seller = car.seller_name;
  const image = car.images;

  return (
    <div className="bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-border">
      {/* Image Container */}
      <div className="relative w-full h-62 bg-muted overflow-hidden">
        {image ? (
          <img src={image || "/placeholder.svg"} alt={title} className="w-full h-full object-cover" />
        )
          : (<div className="flex items-center justify-center h-full text-xs text-gray-400">
            Image coming soon
          </div>)
        }
        <button
          // onClick={handleCopy}
          className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 backdrop-blur-md bg-white/20 border border-white/40 hover:bg-white/30 shadow-lg"
          aria-label="Copy car details"
          title="Copy car details"
        >
          <Copy size={20} className="text-white drop-shadow-lg" />
        </button>
      </div>

      {/* Content Container */}

      <div className="p-4">

        <h3 className="text-foreground font-semibold text-sm mb-2 line-clamp-2">{`${car.year}  ${car.make} ${car.model} ${car.variant}`}</h3>
        <p>{`${car.mileage} | ${car.fuel_type} | ${car.transmission}`}</p>
        <div className="flex ">
          <p className="text-foreground font-bold text-lg">
            ₹{formatMoney(car.price)}
          </p>
          <p className="text-muted-foreground text-xs">
            EMI at ₹{formatMoney(car.emi || 23432)}
          </p>
        </div>
        <div className="flex items-center justify-between bg-gradient-to-r from-teal-500 to-teal-400 rounded-lg px-4 py-2">
          <span className="text-white text-sm font-semibold">
            {car.dealer || car.seller_name}
          </span>

          <div className="flex items-center gap-1 text-white text-xs font-medium">
            {car.city_name || car.location}
            <MapPin size={14} />
          </div>
        </div>

        <p className="text-xs text-gray-400 mt-2 text-right">
          {car.created_date || ""}
        </p>
      </div>
    </div>
  )

}
