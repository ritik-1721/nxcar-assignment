"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { useAppDispatch, useAppSelector } from "../lib/hooks";

interface LocationModalProps {
    isOpen: boolean
    onClose: () => void
    onSelectLocation: (location: string) => void
    currentLocation: string
}

export function LocationModal({ isOpen, onClose, onSelectLocation, currentLocation }: LocationModalProps) {
    const [searchQuery, setSearchQuery] = useState("")

    const dispatch = useAppDispatch();
    const { items: cities, selectedCityId, loading } = useAppSelector(
        (state) => state.cities
    );

    const filteredCities = cities.filter((city) => city.city_name.toLowerCase().includes(searchQuery.toLowerCase()))

    if (!isOpen) return null

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/40 z-70" onClick={onClose} />

            {/* Modal */}
            <div className="fixed inset-0 z-80 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    {/* Header */}
                    <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-foreground">Choose any city where you would like to see cars.</h2>
                        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded transition-colors" aria-label="Close">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="px-6 py-6">
                        {/* Search Input */}
                        <input
                            type="text"
                            placeholder="Enter City"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-teal-50 border border-teal-100 text-foreground placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent mb-6"
                        />

                        {/* City Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {filteredCities.map((city) => (
                                <button
                                    key={city.city_name}
                                    onClick={() => {
                                        onSelectLocation(city.city_id)
                                        onClose()
                                    }}
                                    className="group flex flex-col items-center gap-2 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
                                >
                                    {/* City Image */}
                                    <div className="w-full aspect-square rounded-lg overflow-hidden bg-gray-200">
                                        <img
                                            src={city.city_image || "/placeholder.svg"}
                                            alt={city.city_name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                    </div>

                                    {/* City Name */}
                                    <span className="text-sm font-medium text-foreground text-center group-hover:text-primary transition-colors">
                                        {city.city_name}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {filteredCities.length === 0 && (
                            <div className="text-center py-8 text-gray-500">No cities found matching your search.</div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
