import rawData from '@/../product/sections/okr-rituals/data.json'
import { RitualsDashboard } from './components/RitualsDashboard'
import type { Ritual, Sprint } from '@/../product/sections/okr-rituals/types'

// Cast JSON data to proper types
const data = rawData as unknown as {
  rituals: Ritual[]
  sprints: Sprint[]
}

export default function RitualsDashboardPreview() {
  return (
    <RitualsDashboard
      rituals={data.rituals}
      sprints={data.sprints}
      onCreate={() => console.log('Create new ritual')}
      onView={(id) => console.log('View ritual:', id)}
      onFacilitate={(id) => console.log('Facilitate ritual:', id)}
      onEdit={(id) => console.log('Edit ritual:', id)}
      onDelete={(id) => console.log('Delete ritual:', id)}
      onFilterBySprint={(sprintId) => console.log('Filter by sprint:', sprintId)}
    />
  )
}
