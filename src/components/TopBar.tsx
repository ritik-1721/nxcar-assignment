"use client"

import { useState } from "react"
import { ChevronDown, Menu, X, MapPin, ArrowLeft } from "lucide-react"
import { LocationModal } from "./LocationModal"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { setSelectedCity } from "@/features/cities/citiesSlice"
import { setPage } from "@/features/cars/carsSlice"

const menuItems = ["Buy Car", "Sell Car", "Luxury Car", "Used Car Loan", "Car Service", "My Cars"]

export default function TopBar() {
  const dispatch = useAppDispatch();
  const [selectedLocation, setSelectedLocation] = useState("Delhi")
  const { items: cities, selectedCityId, loading } = useAppSelector((state) => state.cities);

  const selectedCity = cities.find((c) => c.city_id === selectedCityId);

  const [locationModalOpen, setLocationModalOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLocationSelect = (newCityId: string) => {
    dispatch(setSelectedCity(newCityId));
    dispatch(setPage(1));
  }

  return (
    <>
      {/* Mobile Navigation */}
      <nav className="font-noto sticky top-0 z-50 lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">

        {/* LEFT SECTION: Logo + Chevron button */}
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <img
              src="https://www.nxcar.in/assets/logo-BhMbOBYo.svg"
              alt="Nxcar Buy and sell verified cars on Nxcar"
              title="Nxcar || Nxcar.in"
              loading="lazy"
              className="h-7"
            />
          </div>

          <button
            onClick={() => setLocationModalOpen(true)}
            className="flex items-center text-gray-500 rounded-b-sm gap-2 text-sm bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded transition-colors border"
          >
            <span className="font-medium">{selectedCity?.city_name}</span>
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>

        {/* RIGHT SECTION: X / Menu */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          {menuOpen ? (
            <X className="w-7 h-7" />
          ) : (
            <svg
              className="w-7 h-7"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M20.3875 17.2627V18.625H3.57495V17.2627H20.3875ZM20.3875 11.2998V12.7002H3.57495V11.2998H20.3875ZM20.3875 5.375V6.7373H3.57495V5.375H20.3875Z"
                fill="#4A4A4C"
                stroke="#4A4A4C"
              />
            </svg>
          )}
        </button>


      </nav>


      {/* Desktop Navigation */}
      <nav className="font-noto hidden lg:flex sticky top-0 z-50 bg-white border-b border-gray-200 items-center px-6 py-4 gap-8">
        {/* Logo */}
        <div className="flex-shrink-0">
          <img src="https://www.nxcar.in/assets/logo-BhMbOBYo.svg" alt="Nxcar Buy and sell verified cars on Nxcar" title="Nxcar || Nxcar.in" loading="lazy"></img>
        </div>

        {/* Location Selector */}
        <div className="relative">
          <button
            onClick={() => setLocationModalOpen(true)}
            className="flex items-center text-gray-500 rounded-b-sm border-0 gap-2 text-sm text-foreground bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded transition-colors border"
          >
            <MapPin className="w-5 h-5" />
            <span className="font-medium" >{selectedCity?.city_name}</span>
            <ChevronDown className="w-6 h-6 " />
          </button>
        </div>

        {/* Menu Items */}
        <div className="flex flex-row-reverse items-center gap-6 flex-1 ml-4">
          {[...menuItems].reverse().map((item) => (
            <button
              key={item}
              className="text-base text-gray-500 hover:text-teal-600 font-normal relative group transition-colors pb-1"
            >
              {item}
              <div className="absolute left-0 -bottom-0.5 w-0 h-0.5 bg-teal-600 group-hover:w-full transition-all duration-300" />
            </button>
          ))}
        </div>

        {/* Filter Button */}
        <button className="flex items-center gap-2 ml-auto text-teal-800 text-sm font-normal border rounded-b-sm border-teal-800 rounded px-4 py-2 hover:bg-gray-50 transition-colors">
          <span>Login</span>
        </button>
      </nav>

      {/* Mobile Sidebar Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-70 lg:hidden">

          {/* BACKDROP */}
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setMenuOpen(false)}
          />

          {/* SIDEBAR */}
          <div className="absolute right-0 top-0 bottom-0 w-120 max-w-[90%] bg-white shadow-xl overflow-y-auto">

            {/* TOP GRADIENT HEADER WITH BACK ARROW */}
            <div className="px-4 py-4 bg-gradient-to-r from-teal-600 to-teal-400 text-white flex items-center gap-3">
              <button
                onClick={() => setMenuOpen(false)}
                className="p-1 rounded-full hover:bg-white/20 transition"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
            </div>

            <div className="p-4" >

              {/* MAIN MENU ITEMS */}
              <div className="mt-2">
                {menuItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => setMenuOpen(false)}
                    className="
                    w-full text-left py-4 font-medium relative 
                    border-b border-gray-200 
                    text-gray-800
                    group
                    transition-colors
                  "
                  >
                    {/* TEXT with hover color */}
                    <span className="text-gray-800 group-hover:text-teal-600 transition-colors">
                      {item}
                    </span>

                    {/* UNDERLINE ANIMATION */}
                    <div
                      className="
                      absolute left-0 right-6 bottom-0
                      h-[2px] bg-teal-600
                      w-0 group-hover:w-[100%]
                      transition-all duration-300
                    "
                    />
                  </button>
                ))}
              </div>

              {/* EXTRA ITEMS */}
              <div>
                {["My Cars", "About Us", "Help & Support", "Login"].map((item, index) => (
                  <button
                    key={index}
                    onClick={() => setMenuOpen(false)}
                    className="
                     w-full text-left py-4 font-medium relative 
                     border-b border-gray-200 
                     text-gray-800
                     group
                     transition-colors
                   "
                  >
                    {/* TEXT with hover color */}
                    <span className="text-gray-800 group-hover:text-teal-600 transition-colors">
                      {item}
                    </span>

                    {/* UNDERLINE ANIMATION */}
                    <div
                      className="
                       absolute left-0 right-0 bottom-0
                       h-[2px] bg-teal-600
                       w-0 group-hover:w-[100%]
                       transition-all duration-300
                     "
                    />
                  </button>
                ))}
              </div>

            </div>

            {/* FOOTER LINKS */}
            <div className="py-6 px-6 text-sm text-gray-600 space-y-4">

              <div className="flex justify-center items-center gap-3">
                <button className="hover:text-teal-600">Privacy Policy</button>
                <span className="text-gray-400">|</span>
                <button className="hover:text-teal-600">Terms of Use</button>
              </div>

              <div className="flex justify-center items-center gap-3">
                <button className="hover:text-teal-600">Grievance Policy</button>
                <span className="text-gray-400">|</span>
                <button className="hover:text-teal-600">Service Partners</button>
              </div>

            </div>
          </div>
        </div>
      )}


      {/* Location Selection Modal */}
      <LocationModal
        isOpen={locationModalOpen}
        onClose={() => setLocationModalOpen(false)}
        onSelectLocation={handleLocationSelect}
        currentLocation={selectedCity?.city_name || ""}
      />
    </>
  )
}

