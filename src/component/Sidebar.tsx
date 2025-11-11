"use client"

import { useState } from "react"

const ChevronLeftIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
)

const ChevronRightIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
)

const ChevronDownIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
)

const ChevronUpIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
  </svg>
)

const FilterIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
)

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const CONDITIONS = ['New', 'Like New', 'Good', 'Fair']

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [selectedConditions, setSelectedConditions] = useState<string[]>([])
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    size: true,
    condition: true
  })

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const toggleSize = (size: string) => {
    setSelectedSizes(prev =>
      prev.includes(size)
        ? prev.filter(s => s !== size)
        : [...prev, size]
    )
  }

  const toggleCondition = (condition: string) => {
    setSelectedConditions(prev =>
      prev.includes(condition)
        ? prev.filter(c => c !== condition)
        : [...prev, condition]
    )
  }

  const clearFilters = () => {
    setPriceRange([0, 1000])
    setSelectedSizes([])
    setSelectedConditions([])
  }

  const hasActiveFilters = 
    priceRange[0] !== 0 || 
    priceRange[1] !== 1000 || 
    selectedSizes.length > 0 || 
    selectedConditions.length > 0

  return (
    <div className={`bg-white border-r border-gray-200 shadow-sm transition-all duration-300 h-screen overflow-y-auto ${
      isCollapsed ? 'w-16' : 'w-64'
    } flex-shrink-0`}>
      
      {/* Sidebar Header */}
      <div className="sticky top-0 bg-white z-10 border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <div className={`flex items-center gap-2 ${isCollapsed ? 'justify-center' : ''}`}>
            {!isCollapsed ? (
              <>
                <FilterIcon />
                <span className="text-lg font-semibold text-gray-800">Filters</span>
              </>
            ) : (
              <FilterIcon />
            )}
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200"
          >
            {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </button>
        </div>

        {/* Clear Filters Button */}
        {!isCollapsed && hasActiveFilters && (
          <div className="px-4 pb-3">
            <button
              onClick={clearFilters}
              className="w-full px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors duration-200 border border-blue-200"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Filters */}
      {!isCollapsed && (
        <div className="p-4 space-y-6">
          
          {/* Price Range Filter */}
          <div className="space-y-3">
            <button
              onClick={() => toggleSection('price')}
              className="flex items-center justify-between w-full text-sm font-semibold text-gray-800 hover:text-gray-900"
            >
              <span>Price Range</span>
              {expandedSections.price ? <ChevronUpIcon /> : <ChevronDownIcon />}
            </button>
            
            {expandedSections.price && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
                
                <div className="relative h-6 flex items-center">
                  {/* Track background */}
                  <div className="absolute w-full h-2 bg-gray-200 rounded-lg"></div>
                  
                  {/* Active range */}
                  <div 
                    className="absolute h-2 bg-blue-600 rounded-lg pointer-events-none"
                    style={{
                      left: `${(priceRange[0] / 1000) * 100}%`,
                      right: `${100 - (priceRange[1] / 1000) * 100}%`
                    }}
                  ></div>
                  
                  {/* Max range input - higher z-index when both at same position */}
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="10"
                    value={priceRange[1]}
                    onChange={(e) => {
                      const value = parseInt(e.target.value)
                      if (value > priceRange[0]) {
                        setPriceRange([priceRange[0], value])
                      }
                    }}
                    className="absolute w-full appearance-none bg-transparent cursor-pointer slider-max"
                    style={{
                      height: '0px',
                      outline: 'none',
                      zIndex: priceRange[1] - priceRange[0] <= 0 ? 5 : 3
                    }}
                  />
                  
                  {/* Min range input */}
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="10"
                    value={priceRange[0]}
                    onChange={(e) => {
                      const value = parseInt(e.target.value)
                      if (value < priceRange[1]) {
                        setPriceRange([value, priceRange[1]])
                      }
                    }}
                    className="absolute w-full appearance-none bg-transparent cursor-pointer slider-min"
                    style={{
                      height: '0px',
                      outline: 'none',
                      zIndex: priceRange[1] - priceRange[0] <= 0 ? 4 : 5
                    }}
                  />
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 0
                      if (value < priceRange[1] && value >= 0) {
                        setPriceRange([value, priceRange[1]])
                      }
                    }}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Min"
                  />
                  <span className="text-gray-500">-</span>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 1000
                      if (value > priceRange[0] && value <= 1000) {
                        setPriceRange([priceRange[0], value])
                      }
                    }}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Max"
                  />
                </div>

                <style jsx>{`
                  input[type="range"]::-webkit-slider-thumb {
                    appearance: none;
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: #2563eb;
                    cursor: pointer;
                    border: 2px solid white;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.3);
                    pointer-events: all;
                    margin-top: -8px;
                  }
                  
                  input[type="range"]::-moz-range-thumb {
                    appearance: none;
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: #2563eb;
                    cursor: pointer;
                    border: 2px solid white;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.3);
                    pointer-events: all;
                  }
                  
                  input[type="range"]::-webkit-slider-runnable-track {
                    width: 100%;
                    height: 0px;
                    cursor: pointer;
                  }
                  
                  input[type="range"]::-moz-range-track {
                    width: 100%;
                    height: 0px;
                    cursor: pointer;
                  }
                `}</style>
              </div>
            )}
          </div>

          {/* Size Filter */}
          <div className="space-y-3">
            <button
              onClick={() => toggleSection('size')}
              className="flex items-center justify-between w-full text-sm font-semibold text-gray-800 hover:text-gray-900"
            >
              <span>Size</span>
              {expandedSections.size ? <ChevronUpIcon /> : <ChevronDownIcon />}
            </button>
            
            {expandedSections.size && (
              <div className="grid grid-cols-3 gap-2">
                {SIZES.map((size) => (
                  <button
                    key={size}
                    onClick={() => toggleSize(size)}
                    className={`px-3 py-2 text-sm font-medium rounded-md border transition-colors duration-200 ${
                      selectedSizes.includes(size)
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Condition Filter */}
          <div className="space-y-3">
            <button
              onClick={() => toggleSection('condition')}
              className="flex items-center justify-between w-full text-sm font-semibold text-gray-800 hover:text-gray-900"
            >
              <span>Condition</span>
              {expandedSections.condition ? <ChevronUpIcon /> : <ChevronDownIcon />}
            </button>
            
            {expandedSections.condition && (
              <div className="space-y-2">
                {CONDITIONS.map((condition) => (
                  <label
                    key={condition}
                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded-md transition-colors duration-200"
                  >
                    <input
                      type="checkbox"
                      checked={selectedConditions.includes(condition)}
                      onChange={() => toggleCondition(condition)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="text-sm text-gray-700">{condition}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* Collapsed State Indicator */}
      {isCollapsed && hasActiveFilters && (
        <div className="flex justify-center mt-4">
          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
        </div>
      )}
    </div>
  )
}

export default Sidebar