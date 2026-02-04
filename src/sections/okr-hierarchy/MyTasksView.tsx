import { MyTasks } from './components/MyTasks'
import rawData from '@/../product/sections/okr-hierarchy/data.json'
import type { Objective, User } from '@/../product/sections/okr-hierarchy/types'

// Cast JSON data to proper types
const data = rawData as unknown as {
  objectives: Objective[]
  currentUser: User & { entity: string; domain: string }
}

// Typography: Inter for headings and body (from design tokens)
// Colors: teal (primary), blue (secondary), slate (neutral)

export default function MyTasksView() {
  const objectives = data.objectives
  const currentUser = data.currentUser

  const handleToggleTaskStatus = (taskId: string) => {
    console.log('Toggle task status:', taskId)
  }

  const handleEditTask = (taskId: string, description: string, ownerId: string) => {
    console.log('Edit task:', taskId, description, ownerId)
  }

  const handleDeleteTask = (taskId: string) => {
    console.log('Delete task:', taskId)
  }

  const handleNavigateToKeyResult = (keyResultId: string) => {
    console.log('Navigate to Key Result:', keyResultId)
  }

  return (
    <MyTasks
      objectives={objectives}
      currentUser={currentUser}
      onToggleTaskStatus={handleToggleTaskStatus}
      onEditTask={handleEditTask}
      onDeleteTask={handleDeleteTask}
      onNavigateToKeyResult={handleNavigateToKeyResult}
    />
  )
}
