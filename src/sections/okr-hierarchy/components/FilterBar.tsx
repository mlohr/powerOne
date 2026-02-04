import { useState, useRef, useEffect } from 'react'
import { X, Save, Filter, ChevronDown, Sparkles, Search } from 'lucide-react'
import type {
  FilterCriteria,
  OrganizationalLevel,
  OrganizationalUnit,
  ObjectiveStatus,
  Sprint,
  User,
  SavedFilter,
  Program,
} from '@/../product/sections/okr-hierarchy/types'

// Design tokens: primary=teal, secondary=blue, neutral=slate

interface FilterBarProps {
  /** Current filter criteria */
  criteria: FilterCriteria

  /** Currently active saved filter (if any) */
  activeFilter?: SavedFilter | null

  /** Available organizational units (master data) */
  organizationalUnits: OrganizationalUnit[]

  /** Available sprints for selection */
  sprints: Sprint[]

  /** Available programs for selection */
  programs: Program[]

  /** Available users for owner selection */
  users: User[]

  /** Called when filter criteria changes */
  onCriteriaChange: (criteria: FilterCriteria) => void

  /** Called when user wants to save current criteria as a new filter */
  onSaveAsNewFilter?: (name: string, criteria: FilterCriteria, isShared: boolean) => void

  /** Called when user wants to update the active filter */
  onUpdateFilter?: (filterId: string, criteria: FilterCriteria) => void

  /** Called when user clears all filters */
  onClearFilters?: () => void
}

const statuses: ObjectiveStatus[] = [
  'Draft',
  'Accepted',
  'Active',
  'Done',
  'Archived',
  'Cancelled',
]

const levelColors: Record<OrganizationalLevel, string> = {
  Group: 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700',
  Entity: 'bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border-teal-300 dark:border-teal-700',
  Domain: 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700',
  Department: 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700',
  Team: 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-700',
}

const statusColors: Record<ObjectiveStatus, string> = {
  Draft: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700',
  Accepted: 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700',
  Active: 'bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border-teal-300 dark:border-teal-700',
  Done: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700',
  Archived: 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700',
  Cancelled: 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700',
}

// Multi-select dropdown component with search
function MultiSelectDropdown<T extends string>({
  label,
  options,
  selectedValues,
  onToggle,
  getLabel,
  groupBy,
  getGroupLabel,
}: {
  label: string
  options: T[]
  selectedValues: T[]
  onToggle: (value: T) => void
  getLabel?: (value: T) => string
  groupBy?: (value: T) => string
  getGroupLabel?: (groupKey: string) => string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchQuery('')
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      // Focus search input when dropdown opens
      setTimeout(() => searchInputRef.current?.focus(), 0)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const count = selectedValues.length

  // Filter options based on search query
  const filteredOptions = options.filter((option) => {
    const displayLabel = getLabel ? getLabel(option) : option
    return displayLabel.toLowerCase().includes(searchQuery.toLowerCase())
  })

  // Group options if groupBy is provided
  const groupedOptions: Record<string, T[]> = {}
  if (groupBy) {
    filteredOptions.forEach((option) => {
      const groupKey = groupBy(option)
      if (!groupedOptions[groupKey]) {
        groupedOptions[groupKey] = []
      }
      groupedOptions[groupKey].push(option)
    })
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
          count > 0
            ? 'bg-teal-50 dark:bg-teal-950/50 border-teal-300 dark:border-teal-700 text-teal-700 dark:text-teal-300'
            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
        }`}
      >
        <span>{label}</span>
        {count > 0 && (
          <span className="px-1.5 py-0.5 rounded text-xs bg-teal-600 dark:bg-teal-700 text-white">
            {count}
          </span>
        )}
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-72 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-lg">
          {/* Search Input */}
          <div className="p-3 border-b border-slate-200 dark:border-slate-700">
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${label.toLowerCase()}...`}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-600 focus:border-transparent"
            />
          </div>

          {/* Options List */}
          <div className="max-h-64 overflow-y-auto p-2">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
                No results found
              </div>
            ) : groupBy ? (
              // Render grouped options
              Object.keys(groupedOptions).map((groupKey) => {
                if (groupedOptions[groupKey].length === 0) return null

                return (
                  <div key={groupKey}>
                    <div className="px-3 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      {getGroupLabel ? getGroupLabel(groupKey) : groupKey}
                    </div>
                    {groupedOptions[groupKey].map((option) => {
                      const isSelected = selectedValues.includes(option)
                      const displayLabel = getLabel ? getLabel(option) : option

                      return (
                        <label
                          key={option}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => onToggle(option)}
                            className="w-4 h-4 text-teal-600 dark:text-teal-500 rounded border-slate-300 dark:border-slate-600 focus:ring-teal-500 dark:focus:ring-teal-600"
                          />
                          <span className="text-sm text-slate-700 dark:text-slate-300">
                            {displayLabel}
                          </span>
                        </label>
                      )
                    })}
                  </div>
                )
              })
            ) : (
              // Render flat options
              filteredOptions.map((option) => {
                const isSelected = selectedValues.includes(option)
                const displayLabel = getLabel ? getLabel(option) : option

                return (
                  <label
                    key={option}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggle(option)}
                      className="w-4 h-4 text-teal-600 dark:text-teal-500 rounded border-slate-300 dark:border-slate-600 focus:ring-teal-500 dark:focus:ring-teal-600"
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300">{displayLabel}</span>
                  </label>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// Searchable single-select dropdown component
function SearchableSelect<T extends string>({
  label,
  options,
  selectedValue,
  onChange,
  getLabel,
  placeholder = 'Select...',
}: {
  label: string
  options: T[]
  selectedValue?: string
  onChange: (value: string) => void
  getLabel?: (value: T) => string
  placeholder?: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchQuery('')
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      setTimeout(() => searchInputRef.current?.focus(), 0)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Filter options based on search query
  const filteredOptions = options.filter((option) => {
    const displayLabel = getLabel ? getLabel(option) : option
    return displayLabel.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const selectedLabel = selectedValue
    ? getLabel
      ? getLabel(selectedValue as T)
      : selectedValue
    : placeholder

  const hasValue = !!selectedValue

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
          hasValue
            ? 'bg-teal-50 dark:bg-teal-950/50 border-teal-300 dark:border-teal-700 text-teal-700 dark:text-teal-300'
            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
        }`}
      >
        <span className="truncate max-w-[150px]">{selectedLabel}</span>
        <ChevronDown size={14} className={`transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-72 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-lg">
          {/* Search Input */}
          <div className="p-3 border-b border-slate-200 dark:border-slate-700">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                size={16}
              />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${label.toLowerCase()}...`}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-600 focus:border-transparent"
              />
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-64 overflow-y-auto p-2">
            {/* Clear option */}
            {hasValue && (
              <button
                type="button"
                onClick={() => {
                  onChange('')
                  setIsOpen(false)
                  setSearchQuery('')
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-left"
              >
                <X size={14} className="text-slate-400 dark:text-slate-500" />
                <span className="text-sm text-slate-500 dark:text-slate-400 italic">
                  Clear selection
                </span>
              </button>
            )}

            {filteredOptions.length === 0 ? (
              <div className="px-3 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
                No results found
              </div>
            ) : (
              filteredOptions.map((option) => {
                const displayLabel = getLabel ? getLabel(option) : option
                const isSelected = selectedValue === option

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      onChange(option)
                      setIsOpen(false)
                      setSearchQuery('')
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left ${
                      isSelected
                        ? 'bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="text-sm">{displayLabel}</span>
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export function FilterBar({
  criteria,
  activeFilter,
  organizationalUnits,
  sprints,
  programs,
  users,
  onCriteriaChange,
  onSaveAsNewFilter,
  onUpdateFilter,
  onClearFilters,
}: FilterBarProps) {
  const [showSaveInput, setShowSaveInput] = useState(false)
  const [filterName, setFilterName] = useState('')
  const [isShared, setIsShared] = useState(false)

  // Parse criteria into arrays
  const selectedOrgUnitIds = Array.isArray(criteria.organizationalUnitId)
    ? criteria.organizationalUnitId
    : criteria.organizationalUnitId
    ? [criteria.organizationalUnitId]
    : []

  const selectedStatuses = Array.isArray(criteria.status)
    ? criteria.status
    : criteria.status
    ? [criteria.status]
    : []

  const selectedProgramIds = Array.isArray(criteria.programId)
    ? criteria.programId
    : criteria.programId
    ? [criteria.programId]
    : []

  const toggleOrgUnit = (orgUnitId: string) => {
    const newOrgUnits = selectedOrgUnitIds.includes(orgUnitId)
      ? selectedOrgUnitIds.filter((id) => id !== orgUnitId)
      : [...selectedOrgUnitIds, orgUnitId]

    onCriteriaChange({
      ...criteria,
      organizationalUnitId: newOrgUnits.length > 0 ? newOrgUnits : undefined,
    })
  }

  const toggleStatus = (status: ObjectiveStatus) => {
    const newStatuses = selectedStatuses.includes(status)
      ? selectedStatuses.filter((s) => s !== status)
      : [...selectedStatuses, status]

    onCriteriaChange({
      ...criteria,
      status: newStatuses.length > 0 ? newStatuses : undefined,
    })
  }

  const toggleProgram = (programId: string) => {
    const newPrograms = selectedProgramIds.includes(programId)
      ? selectedProgramIds.filter((p) => p !== programId)
      : [...selectedProgramIds, programId]

    onCriteriaChange({
      ...criteria,
      programId: newPrograms.length > 0 ? newPrograms : undefined,
    })
  }

  const removeOrgUnit = (orgUnitId: string) => {
    const newOrgUnits = selectedOrgUnitIds.filter((id) => id !== orgUnitId)
    onCriteriaChange({
      ...criteria,
      organizationalUnitId: newOrgUnits.length > 0 ? newOrgUnits : undefined,
    })
  }

  const removeStatus = (status: ObjectiveStatus) => {
    const newStatuses = selectedStatuses.filter((s) => s !== status)
    onCriteriaChange({
      ...criteria,
      status: newStatuses.length > 0 ? newStatuses : undefined,
    })
  }

  const removeProgram = (programId: string) => {
    const newPrograms = selectedProgramIds.filter((p) => p !== programId)
    onCriteriaChange({
      ...criteria,
      programId: newPrograms.length > 0 ? newPrograms : undefined,
    })
  }

  const removeSprint = () => {
    onCriteriaChange({
      ...criteria,
      sprint: undefined,
    })
  }

  const removeOwner = () => {
    onCriteriaChange({
      ...criteria,
      owner: undefined,
    })
  }

  const handleSaveFilter = () => {
    if (filterName.trim() && onSaveAsNewFilter) {
      onSaveAsNewFilter(filterName.trim(), criteria, isShared)
      setFilterName('')
      setIsShared(false)
      setShowSaveInput(false)
    }
  }

  const handleUpdateFilter = () => {
    if (activeFilter && !activeFilter.isPreset && onUpdateFilter) {
      onUpdateFilter(activeFilter.id, criteria)
    }
  }

  const hasActiveFilters =
    selectedOrgUnitIds.length > 0 ||
    selectedStatuses.length > 0 ||
    selectedProgramIds.length > 0 ||
    !!criteria.sprint ||
    !!criteria.owner

  const canUpdateFilter = activeFilter && !activeFilter.isPreset && hasActiveFilters

  const selectedSprint = sprints.find((s) => s.id === criteria.sprint)
  const selectedOwner = users.find((u) => u.id === criteria.owner)

  return (
    <div className="border-t border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="space-y-4">
          {/* Active Filter Name */}
          {activeFilter && (
            <div className="flex items-center gap-2">
              <Filter className="text-teal-600 dark:text-teal-400" size={16} />
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-teal-100 dark:bg-teal-950 border border-teal-200 dark:border-teal-800">
                {activeFilter.isPreset && (
                  <Sparkles className="text-teal-600 dark:text-teal-400" size={14} />
                )}
                <span className="text-sm font-medium text-teal-700 dark:text-teal-300">
                  {activeFilter.name}
                </span>
                {activeFilter.isPreset && (
                  <span className="text-xs text-teal-600 dark:text-teal-400">(Preset)</span>
                )}
              </div>
            </div>
          )}

          {/* Filter Dropdowns */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <Filter size={16} />
              <span className="font-medium">Filters:</span>
            </div>

            {/* Organizational Unit Selector - grouped by level */}
            <MultiSelectDropdown
              label="Organizational Unit"
              options={organizationalUnits.map((ou) => ou.id)}
              selectedValues={selectedOrgUnitIds}
              onToggle={toggleOrgUnit}
              getLabel={(id) => organizationalUnits.find((ou) => ou.id === id)?.name || id}
              groupBy={(id) => organizationalUnits.find((ou) => ou.id === id)?.level || 'Other'}
              getGroupLabel={(level) => level}
            />

            <MultiSelectDropdown
              label="Status"
              options={statuses}
              selectedValues={selectedStatuses}
              onToggle={toggleStatus}
            />

            <MultiSelectDropdown
              label="Programs"
              options={programs.map((p) => p.id)}
              selectedValues={selectedProgramIds}
              onToggle={toggleProgram}
              getLabel={(id) => programs.find((p) => p.id === id)?.name || id}
            />

            {/* Sprint Selector */}
            <SearchableSelect
              label="Sprint"
              options={sprints.map((s) => s.id)}
              selectedValue={criteria.sprint}
              onChange={(value) =>
                onCriteriaChange({
                  ...criteria,
                  sprint: value || undefined,
                })
              }
              getLabel={(id) => sprints.find((s) => s.id === id)?.name || id}
              placeholder="Sprint"
            />

            {/* Owner Selector */}
            <SearchableSelect
              label="Owner"
              options={users.map((u) => u.id)}
              selectedValue={criteria.owner}
              onChange={(value) =>
                onCriteriaChange({
                  ...criteria,
                  owner: value || undefined,
                })
              }
              getLabel={(id) => users.find((u) => u.id === id)?.name || id}
              placeholder="Owner"
            />

            {/* Action Buttons */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2 ml-auto">
                {canUpdateFilter && (
                  <button
                    type="button"
                    onClick={handleUpdateFilter}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-medium text-sm"
                  >
                    <Save size={14} />
                    Update
                  </button>
                )}

                {!showSaveInput && (
                  <button
                    type="button"
                    onClick={() => setShowSaveInput(true)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg border border-teal-600 dark:border-teal-700 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950 transition-colors font-medium text-sm"
                  >
                    <Save size={14} />
                    Save
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    onClearFilters?.()
                    setShowSaveInput(false)
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-medium text-sm"
                >
                  <X size={14} />
                  Clear
                </button>
              </div>
            )}
          </div>

          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Active filters:
              </span>

              {/* Organizational Unit Chips */}
              {selectedOrgUnitIds.map((orgUnitId) => {
                const orgUnit = organizationalUnits.find((ou) => ou.id === orgUnitId)
                if (!orgUnit) return null

                return (
                  <button
                    key={orgUnitId}
                    type="button"
                    onClick={() => removeOrgUnit(orgUnitId)}
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium border transition-colors hover:opacity-80 ${levelColors[orgUnit.level]}`}
                  >
                    {orgUnit.name}
                    <X size={12} />
                  </button>
                )
              })}

              {/* Status Chips */}
              {selectedStatuses.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => removeStatus(status)}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium border transition-colors hover:opacity-80 ${statusColors[status]}`}
                >
                  {status}
                  <X size={12} />
                </button>
              ))}

              {/* Program Chips */}
              {selectedProgramIds.map((programId) => {
                const program = programs.find((p) => p.id === programId)
                return (
                  <button
                    key={programId}
                    type="button"
                    onClick={() => removeProgram(programId)}
                    className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium border bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700 transition-colors hover:opacity-80"
                  >
                    {program?.name || programId}
                    <X size={12} />
                  </button>
                )
              })}

              {/* Sprint Chip */}
              {selectedSprint && (
                <button
                  type="button"
                  onClick={removeSprint}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium border bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 border-cyan-300 dark:border-cyan-700 transition-colors hover:opacity-80"
                >
                  {selectedSprint.name}
                  <X size={12} />
                </button>
              )}

              {/* Owner Chip */}
              {selectedOwner && (
                <button
                  type="button"
                  onClick={removeOwner}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium border bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 border-violet-300 dark:border-violet-700 transition-colors hover:opacity-80"
                >
                  {selectedOwner.name}
                  <X size={12} />
                </button>
              )}
            </div>
          )}

          {/* Save Filter Input */}
          {showSaveInput && (
            <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-950/50 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex-1">
                <input
                  type="text"
                  value={filterName}
                  onChange={(e) => setFilterName(e.target.value)}
                  placeholder="Enter filter name..."
                  className="w-full px-3 py-2 rounded-lg border border-blue-300 dark:border-blue-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveFilter()
                    if (e.key === 'Escape') setShowSaveInput(false)
                  }}
                  autoFocus
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-blue-900 dark:text-blue-100">
                <input
                  type="checkbox"
                  checked={isShared}
                  onChange={(e) => setIsShared(e.target.checked)}
                  className="w-4 h-4 text-teal-600 dark:text-teal-500 rounded border-blue-300 dark:border-blue-700 focus:ring-teal-500 dark:focus:ring-teal-600"
                />
                Share
              </label>
              <button
                type="button"
                onClick={handleSaveFilter}
                disabled={!filterName.trim()}
                className="px-4 py-2 rounded-lg bg-teal-600 dark:bg-teal-700 text-white hover:bg-teal-700 dark:hover:bg-teal-600 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Filter
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowSaveInput(false)
                  setFilterName('')
                  setIsShared(false)
                }}
                className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-medium text-sm"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
