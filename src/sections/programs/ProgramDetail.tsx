import rawData from '@/../product/sections/programs/data.json'
import { ProgramDetail } from './components/ProgramDetail'
import type { Program } from '@/../product/sections/programs/types'

// Cast JSON data to proper types
const data = rawData as unknown as { programs: Program[] }

export default function ProgramDetailPreview() {
  // Use the first program with linked objectives for the preview
  const program = data.programs.find(p => p.linkedObjectives.length > 0) || data.programs[0]

  return (
    <ProgramDetail
      program={program}
      onEdit={() => console.log('Edit program:', program.id)}
      onDelete={() => console.log('Delete program:', program.id)}
      onViewObjective={(id) => console.log('View objective:', id)}
      onBack={() => console.log('Back to programs dashboard')}
    />
  )
}
