import rawData from '@/../product/sections/programs/data.json'
import { ProgramsDashboard } from './components/ProgramsDashboard'
import type { Program } from '@/../product/sections/programs/types'

// Cast JSON data to proper types
const data = rawData as unknown as { programs: Program[] }

export default function ProgramsDashboardPreview() {
  return (
    <ProgramsDashboard
      programs={data.programs}
      onCreate={() => console.log('Create new program')}
      onView={(id) => console.log('View program:', id)}
      onEdit={(id) => console.log('Edit program:', id)}
      onDelete={(id) => console.log('Delete program:', id)}
      onSearch={(query) => console.log('Search:', query)}
      onFilterByLead={(leadId) => console.log('Filter by lead:', leadId)}
      onFilterByEntity={(entity) => console.log('Filter by entity:', entity)}
    />
  )
}
