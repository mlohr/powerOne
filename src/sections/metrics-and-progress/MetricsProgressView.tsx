import data from '@/../product/sections/metrics-and-progress/data.json'
import type { Sprint, OrganizationalUnit, Objective, KeyResult } from '@/../product/sections/metrics-and-progress/types'
import { MetricsProgress } from './components/MetricsProgress'

export default function MetricsProgressView() {
  return (
    <MetricsProgress
      currentUser={data.currentUser}
      activeSprint={data.activeSprint as Sprint}
      organizationalUnits={data.organizationalUnits as OrganizationalUnit[]}
      objectives={data.objectives as Objective[]}
      keyResults={data.keyResults as KeyResult[]}
      onUpdateMetric={(metricId, newValue) => {
        console.log('Update metric:', metricId, 'to', newValue)
      }}
    />
  )
}
