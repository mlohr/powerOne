import { useState, useEffect } from 'react'
import {
  ChevronRight,
  ChevronDown,
  Plus,
  LayoutGrid,
  List,
  Target,
  TrendingUp,
  ArrowRight,
  Network,
} from 'lucide-react'
import type { OKRHierarchyProps, Objective, FilterCriteria } from '@/../product/sections/okr-hierarchy/types'
import { FilterBar } from './FilterBar'
import { TaskList } from './TaskList'

// Design tokens: primary=teal, secondary=blue, neutral=slate
// Typography: Inter (heading & body), JetBrains Mono (mono)

const levelColors = {
  Group: 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
  Entity: 'bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800',
  Domain: 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  Department: 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  Team: 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
}

const statusColors = {
  Draft: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
  Accepted: 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300',
  Active: 'bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300',
  Done: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300',
  Archived: 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400',
  Cancelled: 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300',
}

export function OKRHierarchyList({
  objectives,
  organizationalUnits,
  sprints,
  programs,
  savedFilters,
  currentUser,
  viewMode = 'full',
  activeFilterId,
  expandedObjectiveIds = [],
  onCreateObjective,
  onCreateKeyResult,
  onEditObjective,
  onEditKeyResult,
  onToggleViewMode,
  onToggleObjective,
  onFilterChange,
  onSaveAsNewFilter,
  onUpdateFilter,
  onClearFilters,
}: OKRHierarchyProps) {
  const [localExpanded, setLocalExpanded] = useState<Set<string>>(
    new Set(expandedObjectiveIds)
  )

  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>({})

  // State for highlighting objectives when navigating
  const [highlightedObjectiveId, setHighlightedObjectiveId] = useState<string | null>(null)

  // Clear highlight after animation
  useEffect(() => {
    if (highlightedObjectiveId) {
      const timer = setTimeout(() => {
        setHighlightedObjectiveId(null)
      }, 2000) // Clear after 2 seconds
      return () => clearTimeout(timer)
    }
  }, [highlightedObjectiveId])

  // Get active filter
  const activeFilter = savedFilters?.find((f) => f.id === activeFilterId) || null

  // Extract unique users from objectives
  const users = [
    currentUser,
    ...objectives
      .map((obj) => obj.owner)
      .filter((u, i, arr) => arr.findIndex((user) => user.id === u.id) === i),
  ]

  // Helper to get organizational unit for an objective
  const getOrgUnit = (objective: Objective) => {
    return organizationalUnits.find((ou) => ou.id === objective.organizationalUnitId)
  }

  const handleFilterChange = (criteria: FilterCriteria) => {
    setFilterCriteria(criteria)
    onFilterChange?.(criteria)
  }

  const handleClearFilters = () => {
    setFilterCriteria({})
    onClearFilters?.()
  }

  const handleToggleExpand = (objectiveId: string) => {
    const newExpanded = new Set(localExpanded)
    if (newExpanded.has(objectiveId)) {
      newExpanded.delete(objectiveId)
    } else {
      newExpanded.add(objectiveId)
    }
    setLocalExpanded(newExpanded)
    onToggleObjective?.(objectiveId)
  }

  const handleNavigateToObjective = (objectiveId: string) => {
    // Scroll to the objective
    const element = document.getElementById(`objective-${objectiveId}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      // Highlight the objective
      setHighlightedObjectiveId(objectiveId)
      // Expand the objective to show its key results
      const newExpanded = new Set(localExpanded)
      newExpanded.add(objectiveId)
      setLocalExpanded(newExpanded)
      onToggleObjective?.(objectiveId)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getProgramNames = (objective: Objective) => {
    return objective.programIds
      .map((pid) => programs.find((p) => p.id === pid)?.name)
      .filter(Boolean)
      .join(', ')
  }

  // Calculate cascade level (depth in hierarchy)
  const getCascadeLevel = (objective: Objective): number => {
    if (!objective.parentObjectiveId) return 0
    const parent = objectives.find((o) => o.id === objective.parentObjectiveId)
    return parent ? getCascadeLevel(parent) + 1 : 0
  }

  // Get the full ancestor chain for an objective (from top-level down to parent)
  const getAncestorChain = (objective: Objective): Objective[] => {
    const ancestors: Objective[] = []
    let current = objective

    // Walk up the parent chain
    while (current.parentObjectiveId) {
      const parent = objectives.find((o) => o.id === current.parentObjectiveId)
      if (parent) {
        ancestors.unshift(parent) // Add to beginning of array
        current = parent
      } else {
        break
      }
    }

    return ancestors
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header & Controls */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                OKR Hierarchy
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Manage objectives and key results across all organizational levels
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                <button
                  onClick={() => onToggleViewMode?.('full')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'full'
                      ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                  title="Full view"
                >
                  <List size={18} />
                </button>
                <button
                  onClick={() => onToggleViewMode?.('compact')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'compact'
                      ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                  title="Compact view"
                >
                  <LayoutGrid size={18} />
                </button>
                <button
                  onClick={() => onToggleViewMode?.('hierarchy')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'hierarchy'
                      ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                  title="Hierarchy view"
                >
                  <Network size={18} />
                </button>
              </div>

              {/* Actions */}
              <button
                onClick={() => onCreateKeyResult?.()}
                className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-medium text-sm"
              >
                New Key Result
              </button>
              <button
                onClick={onCreateObjective}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-600 dark:bg-teal-700 text-white hover:bg-teal-700 dark:hover:bg-teal-600 transition-colors font-medium text-sm shadow-sm"
              >
                <Plus size={18} />
                New Objective
              </button>
            </div>
          </div>

          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm">
            {highlightedObjectiveId ? (
              // Show OKR Cascade Breadcrumb
              <>
                <Target size={14} className="text-teal-600 dark:text-teal-400" />
                <span className="text-slate-500 dark:text-slate-500 text-xs font-medium uppercase tracking-wide">
                  OKR Cascade:
                </span>
                {(() => {
                  const focusedObj = objectives.find((o) => o.id === highlightedObjectiveId)
                  if (!focusedObj) return null

                  const ancestors = getAncestorChain(focusedObj)

                  return (
                    <>
                      {ancestors.length === 0 && (
                        <>
                          <ChevronRight size={14} className="text-slate-400 dark:text-slate-600" />
                          <span className="text-slate-600 dark:text-slate-400 text-xs">
                            Top-level objective
                          </span>
                        </>
                      )}
                      {ancestors.map((ancestor) => (
                        <div key={ancestor.id} className="flex items-center gap-2">
                          <ChevronRight size={14} className="text-slate-400 dark:text-slate-600" />
                          <button
                            onClick={() => handleNavigateToObjective(ancestor.id)}
                            className="text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors truncate max-w-[200px]"
                            title={ancestor.title}
                          >
                            {ancestor.title}
                          </button>
                        </div>
                      ))}
                      <ChevronRight size={14} className="text-slate-400 dark:text-slate-600" />
                      <span
                        className="text-slate-900 dark:text-slate-100 font-medium truncate max-w-[300px]"
                        title={focusedObj.title}
                      >
                        {focusedObj.title}
                      </span>
                      {focusedObj.childObjectiveIds.length > 0 && (
                        <span className="text-xs text-teal-600 dark:text-teal-400 ml-2">
                          ({focusedObj.childObjectiveIds.length} child
                          {focusedObj.childObjectiveIds.length > 1 ? 'ren' : ''})
                        </span>
                      )}
                    </>
                  )
                })()}
              </>
            ) : (
              // Show Organizational Breadcrumb (default)
              <>
                <button className="text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  All Organizations
                </button>
                <ChevronRight size={14} className="text-slate-400 dark:text-slate-600" />
                <span className="text-slate-900 dark:text-slate-100 font-medium">
                  {currentUser.entity}
                </span>
                <ChevronRight size={14} className="text-slate-400 dark:text-slate-600" />
                <span className="text-slate-900 dark:text-slate-100 font-medium">
                  {currentUser.domain}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar
        criteria={filterCriteria}
        activeFilter={activeFilter}
        organizationalUnits={organizationalUnits}
        sprints={sprints}
        programs={programs}
        users={users}
        onCriteriaChange={handleFilterChange}
        onSaveAsNewFilter={onSaveAsNewFilter}
        onUpdateFilter={onUpdateFilter}
        onClearFilters={handleClearFilters}
      />

      {/* Objectives List */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="space-y-3">
          {objectives.map((objective) => {
            const isExpanded = localExpanded.has(objective.id)

            // Hierarchy View
            if (viewMode === 'hierarchy') {
              const cascadeLevel = getCascadeLevel(objective)
              const indentSize = cascadeLevel * 48 // 48px per level

              return (
                <div
                  key={objective.id}
                  id={`objective-${objective.id}`}
                  className="relative"
                  style={{ marginLeft: `${indentSize}px` }}
                >
                  {/* Connector Lines */}
                  {objective.parentObjectiveId && (
                    <>
                      {/* Vertical line from parent */}
                      <div
                        className="absolute left-0 top-0 w-0.5 bg-slate-300 dark:bg-slate-700"
                        style={{
                          height: '24px',
                          left: '-24px',
                        }}
                      />
                      {/* Horizontal line to card */}
                      <div
                        className="absolute top-6 left-0 h-0.5 bg-slate-300 dark:bg-slate-700"
                        style={{
                          width: '24px',
                          left: '-24px',
                        }}
                      />
                    </>
                  )}

                  {/* Objective Card */}
                  <div
                    className={`bg-white dark:bg-slate-900 rounded-lg border transition-all cursor-pointer ${
                      highlightedObjectiveId === objective.id
                        ? 'border-teal-500 dark:border-teal-500 shadow-lg shadow-teal-500/50 dark:shadow-teal-500/30 ring-2 ring-teal-500 dark:ring-teal-500'
                        : 'border-slate-200 dark:border-slate-800 hover:border-teal-300 dark:hover:border-teal-700'
                    }`}
                    onClick={() => handleToggleExpand(objective.id)}
                  >
                    <div className="p-4 flex items-center gap-4">
                      <button className="text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400">
                        {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <Target
                            size={16}
                            className="text-teal-600 dark:text-teal-400 flex-shrink-0"
                          />
                          <h3 className="font-semibold text-slate-900 dark:text-slate-100 flex-1">
                            {objective.title}
                          </h3>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              onEditObjective?.(objective.id)
                            }}
                            className="text-xs text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors font-medium"
                          >
                            Edit
                          </button>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1">
                          {objective.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Owner */}
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 flex items-center justify-center text-xs font-medium">
                            {getInitials(objective.owner.name)}
                          </div>
                        </div>

                        {/* Status */}
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            statusColors[objective.status]
                          }`}
                        >
                          {objective.status}
                        </span>

                        {/* Progress */}
                        <div className="flex items-center gap-2 min-w-[100px]">
                          <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-teal-500 dark:bg-teal-600 transition-all"
                              style={{ width: `${objective.progress}%` }}
                            />
                          </div>
                          <span className="text-xs font-mono font-medium text-slate-700 dark:text-slate-300 min-w-[35px] text-right">
                            {objective.progress}%
                          </span>
                        </div>

                        {/* Organizational Unit Badge */}
                        {(() => {
                          const orgUnit = getOrgUnit(objective)
                          if (!orgUnit) return null

                          return (
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                                levelColors[orgUnit.level]
                              }`}
                            >
                              {orgUnit.name}
                            </span>
                          )
                        })()}

                        {/* Cascade Indicator */}
                        {objective.childObjectiveIds.length > 0 && (
                          <span className="text-xs text-slate-500 dark:text-slate-500">
                            {objective.childObjectiveIds.length} child
                            {objective.childObjectiveIds.length > 1 ? 'ren' : ''}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Expanded Key Results */}
                    {isExpanded && objective.keyResults.length > 0 && (
                      <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                            Key Results
                          </h4>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              onCreateKeyResult?.(objective.id)
                            }}
                            className="text-xs text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium"
                          >
                            + Add Key Result
                          </button>
                        </div>
                        <div className="space-y-4">
                          {objective.keyResults.map((kr) => (
                            <div key={kr.id} className="bg-white dark:bg-slate-900 rounded-lg p-3">
                              {/* Key Result Header */}
                              <div
                                className="flex items-center gap-3 group"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <TrendingUp
                                  size={14}
                                  className="text-blue-500 dark:text-blue-400 flex-shrink-0"
                                />
                                <span className="flex-1 text-sm text-slate-700 dark:text-slate-300">
                                  {kr.title}
                                </span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    onEditKeyResult?.(kr.id)
                                  }}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                                >
                                  Edit
                                </button>
                                <div className="flex items-center gap-2">
                                  <div className="w-20 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-blue-500 dark:bg-blue-600"
                                      style={{ width: `${kr.progress}%` }}
                                    />
                                  </div>
                                  <span className="text-xs font-mono text-slate-600 dark:text-slate-400 min-w-[30px] text-right">
                                    {kr.progress}%
                                  </span>
                                </div>
                                {kr.linkedChildObjectiveId && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleNavigateToObjective(kr.linkedChildObjectiveId!)
                                    }}
                                    className="flex items-center gap-1 text-xs text-teal-600 dark:text-teal-400 hover:underline"
                                    title={`Cascades to: ${
                                      objectives.find((o) => o.id === kr.linkedChildObjectiveId)
                                        ?.title
                                    }`}
                                  >
                                    <ArrowRight size={10} />
                                  </button>
                                )}
                              </div>

                              {/* Tasks */}
                              <TaskList
                                tasks={kr.tasks || []}
                                keyResultId={kr.id}
                                users={users}
                                currentUser={currentUser}
                                onAddTask={(description, ownerId) => {
                                  console.log('Add task:', kr.id, description, ownerId)
                                }}
                                onToggleTaskStatus={(taskId) => {
                                  console.log('Toggle task:', taskId)
                                }}
                                onDeleteTask={(taskId) => {
                                  console.log('Delete task:', taskId)
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            }

            if (viewMode === 'compact') {
              return (
                <div
                  key={objective.id}
                  id={`objective-${objective.id}`}
                  className={`bg-white dark:bg-slate-900 rounded-lg border transition-all cursor-pointer ${
                    highlightedObjectiveId === objective.id
                      ? 'border-teal-500 dark:border-teal-500 shadow-lg shadow-teal-500/50 dark:shadow-teal-500/30 ring-2 ring-teal-500 dark:ring-teal-500'
                      : 'border-slate-200 dark:border-slate-800 hover:border-teal-300 dark:hover:border-teal-700'
                  }`}
                  onClick={() => handleToggleExpand(objective.id)}
                >
                  <div className="p-4 flex items-center gap-4">
                    <button className="text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400">
                      {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </button>

                    <div className="flex-1 min-w-0 flex items-center gap-3">
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate flex-1">
                        {objective.title}
                      </h3>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onEditObjective?.(objective.id)
                        }}
                        className="text-xs text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors font-medium flex-shrink-0"
                      >
                        Edit
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Owner */}
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 flex items-center justify-center text-xs font-medium">
                          {getInitials(objective.owner.name)}
                        </div>
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {objective.owner.name}
                        </span>
                      </div>

                      {/* Status */}
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          statusColors[objective.status]
                        }`}
                      >
                        {objective.status}
                      </span>

                      {/* Progress */}
                      <div className="flex items-center gap-2 min-w-[120px]">
                        <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-teal-500 dark:bg-teal-600 transition-all"
                            style={{ width: `${objective.progress}%` }}
                          />
                        </div>
                        <span className="text-sm font-mono font-medium text-slate-700 dark:text-slate-300 min-w-[40px] text-right">
                          {objective.progress}%
                        </span>
                      </div>

                      {/* Organizational Unit Badge */}
                      {(() => {
                        const orgUnit = getOrgUnit(objective)
                        if (!orgUnit) return null

                        return (
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium border ${
                              levelColors[orgUnit.level]
                            }`}
                          >
                            {orgUnit.name}
                          </span>
                        )
                      })()}
                    </div>
                  </div>

                  {/* Expanded Key Results */}
                  {isExpanded && objective.keyResults.length > 0 && (
                    <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                          Key Results
                        </h4>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onCreateKeyResult?.(objective.id)
                          }}
                          className="text-xs text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium"
                        >
                          + Add Key Result
                        </button>
                      </div>
                      <div className="space-y-4">
                        {objective.keyResults.map((kr) => (
                          <div key={kr.id} className="bg-white dark:bg-slate-900 rounded-lg p-3">
                            {/* Key Result Header */}
                            <div
                              className="flex items-center gap-3 group"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <TrendingUp
                                size={16}
                                className="text-blue-500 dark:text-blue-400 flex-shrink-0"
                              />
                              <span className="flex-1 text-sm text-slate-700 dark:text-slate-300">
                                {kr.title}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onEditKeyResult?.(kr.id)
                                }}
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                              >
                                Edit
                              </button>
                              <div className="flex items-center gap-2">
                                <div className="w-24 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-blue-500 dark:bg-blue-600"
                                    style={{ width: `${kr.progress}%` }}
                                  />
                                </div>
                                <span className="text-xs font-mono text-slate-600 dark:text-slate-400 min-w-[35px] text-right">
                                  {kr.progress}%
                                </span>
                              </div>
                            </div>

                            {/* Tasks */}
                            <TaskList
                              tasks={kr.tasks || []}
                              keyResultId={kr.id}
                              users={users}
                              currentUser={currentUser}
                              onAddTask={(description, ownerId) => {
                                console.log('Add task:', kr.id, description, ownerId)
                              }}
                              onToggleTaskStatus={(taskId) => {
                                console.log('Toggle task:', taskId)
                              }}
                              onDeleteTask={(taskId) => {
                                console.log('Delete task:', taskId)
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            }

            // Full View
            return (
              <div
                key={objective.id}
                id={`objective-${objective.id}`}
                className={`bg-white dark:bg-slate-900 rounded-lg border transition-all overflow-hidden ${
                  highlightedObjectiveId === objective.id
                    ? 'border-teal-500 dark:border-teal-500 shadow-lg shadow-teal-500/50 dark:shadow-teal-500/30 ring-2 ring-teal-500 dark:ring-teal-500'
                    : 'border-slate-200 dark:border-slate-800 hover:border-teal-300 dark:hover:border-teal-700'
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => handleToggleExpand(objective.id)}
                      className="mt-1 text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400 transition-colors"
                    >
                      {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Target
                              size={18}
                              className="text-teal-600 dark:text-teal-400 flex-shrink-0"
                            />
                            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                              {objective.title}
                            </h3>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                            {objective.description}
                          </p>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onEditObjective?.(objective.id)
                          }}
                          className="text-sm text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors font-medium"
                        >
                          Edit
                        </button>
                      </div>

                      {/* Metadata Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        {/* Owner */}
                        <div>
                          <div className="text-xs text-slate-500 dark:text-slate-500 font-medium mb-1.5">
                            Owner
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 flex items-center justify-center text-xs font-medium">
                              {getInitials(objective.owner.name)}
                            </div>
                            <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                              {objective.owner.name}
                            </span>
                          </div>
                        </div>

                        {/* Organizational Unit */}
                        <div>
                          <div className="text-xs text-slate-500 dark:text-slate-500 font-medium mb-1.5">
                            Organizational Unit
                          </div>
                          {(() => {
                            const orgUnit = getOrgUnit(objective)
                            if (!orgUnit) return null

                            return (
                              <div className="flex flex-col gap-1">
                                <span
                                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border w-fit ${
                                    levelColors[orgUnit.level]
                                  }`}
                                >
                                  {orgUnit.name}
                                </span>
                                <span className="text-xs text-slate-600 dark:text-slate-400">
                                  {orgUnit.level}
                                </span>
                              </div>
                            )
                          })()}
                        </div>

                        {/* Status */}
                        <div>
                          <div className="text-xs text-slate-500 dark:text-slate-500 font-medium mb-1.5">
                            Status
                          </div>
                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                              statusColors[objective.status]
                            }`}
                          >
                            {objective.status}
                          </span>
                        </div>

                        {/* Sprint */}
                        <div>
                          <div className="text-xs text-slate-500 dark:text-slate-500 font-medium mb-1.5">
                            Sprint
                          </div>
                          <span className="text-sm font-mono font-medium text-slate-900 dark:text-slate-100">
                            {objective.sprint}
                          </span>
                        </div>
                      </div>

                      {/* Progress & Additional Info */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        {/* Progress */}
                        <div>
                          <div className="text-xs text-slate-500 dark:text-slate-500 font-medium mb-1.5">
                            Progress
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-teal-500 dark:bg-teal-600 transition-all"
                                style={{ width: `${objective.progress}%` }}
                              />
                            </div>
                            <span className="text-sm font-mono font-bold text-teal-700 dark:text-teal-300 min-w-[45px]">
                              {objective.progress}%
                            </span>
                          </div>
                        </div>

                        {/* Key Results Count */}
                        <div>
                          <div className="text-xs text-slate-500 dark:text-slate-500 font-medium mb-1.5">
                            Key Results
                          </div>
                          <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                            {objective.keyResultCount} KRs
                          </span>
                        </div>

                        {/* Programs */}
                        {objective.programIds.length > 0 && (
                          <div>
                            <div className="text-xs text-slate-500 dark:text-slate-500 font-medium mb-1.5">
                              Programs
                            </div>
                            <span className="text-sm text-blue-600 dark:text-blue-400">
                              {getProgramNames(objective)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Parent/Child Links */}
                      {(objective.parentObjectiveId || objective.childObjectiveIds.length > 0) && (
                        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                          <div className="space-y-3">
                            {objective.parentObjectiveId && (
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-500 dark:text-slate-500 font-medium">
                                  ↑ Cascades from:
                                </span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleNavigateToObjective(objective.parentObjectiveId!)
                                  }}
                                  className="text-xs text-teal-600 dark:text-teal-400 hover:underline font-medium"
                                >
                                  {
                                    objectives.find((o) => o.id === objective.parentObjectiveId)
                                      ?.title
                                  }
                                </button>
                              </div>
                            )}
                            {objective.childObjectiveIds.length > 0 && (
                              <div className="flex items-start gap-2">
                                <span className="text-xs text-slate-500 dark:text-slate-500 font-medium whitespace-nowrap">
                                  ↓ Cascades to:
                                </span>
                                <div className="flex flex-wrap gap-x-3 gap-y-1">
                                  {objective.childObjectiveIds.map((childId) => {
                                    const childObj = objectives.find((o) => o.id === childId)
                                    if (!childObj) return null
                                    return (
                                      <button
                                        key={childId}
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          handleNavigateToObjective(childId)
                                        }}
                                        className="text-xs text-teal-600 dark:text-teal-400 hover:underline"
                                      >
                                        {childObj.title}
                                      </button>
                                    )
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Key Results */}
                {isExpanded && objective.keyResults.length > 0 && (
                  <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                    <div className="p-6 space-y-3">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                          Key Results
                        </h4>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onCreateKeyResult?.(objective.id)
                          }}
                          className="text-sm text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium"
                        >
                          + Add Key Result
                        </button>
                      </div>

                      {objective.keyResults.map((kr, idx) => (
                        <div
                          key={kr.id}
                          className="p-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all group"
                        >
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">
                              {idx + 1}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-4 mb-3">
                                <p className="text-sm font-medium text-slate-900 dark:text-slate-100 leading-relaxed">
                                  {kr.title}
                                </p>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    onEditKeyResult?.(kr.id)
                                  }}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                                >
                                  Edit
                                </button>
                              </div>

                              <div className="flex items-center gap-4 mb-3">
                                <div className="flex items-center gap-2 flex-1">
                                  <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-blue-500 dark:bg-blue-600 transition-all"
                                      style={{ width: `${kr.progress}%` }}
                                    />
                                  </div>
                                  <span className="text-xs font-mono font-bold text-blue-700 dark:text-blue-300 min-w-[40px]">
                                    {kr.progress}%
                                  </span>
                                </div>

                                <span
                                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    statusColors[kr.status]
                                  }`}
                                >
                                  {kr.status}
                                </span>

                                {kr.linkedChildObjectiveId && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleNavigateToObjective(kr.linkedChildObjectiveId!)
                                    }}
                                    className="flex items-center gap-1 text-xs text-teal-600 dark:text-teal-400 hover:underline"
                                    title={`Cascades to: ${
                                      objectives.find((o) => o.id === kr.linkedChildObjectiveId)
                                        ?.title
                                    }`}
                                  >
                                    <ArrowRight size={12} />
                                    Cascades to objective
                                  </button>
                                )}
                              </div>

                              {/* Tasks */}
                              <TaskList
                                tasks={kr.tasks || []}
                                keyResultId={kr.id}
                                users={users}
                                currentUser={currentUser}
                                onAddTask={(description, ownerId) => {
                                  console.log('Add task:', kr.id, description, ownerId)
                                }}
                                onToggleTaskStatus={(taskId) => {
                                  console.log('Toggle task:', taskId)
                                }}
                                onDeleteTask={(taskId) => {
                                  console.log('Delete task:', taskId)
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
