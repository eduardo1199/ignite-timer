import { CyclesState } from '../../@types/styled'
import { ActionTypes } from './actions'

import { produce } from 'immer'

export function cylesReducer(state: CyclesState, action: any) {
  switch (action.type) {
    case ActionTypes.ADD:
      return produce(state, (draft) => {
        draft.cycles.push(action.payload.data)
        draft.activeCycleId = action.payload.data.id
      })
    case ActionTypes.INTERRUPT: {
      const currentCycleIndex = state.cycles.findIndex(
        (cycle) => cycle.id === state.activeCycleId,
      )

      if (currentCycleIndex < 0) return state

      return produce(state, (draft) => {
        draft.activeCycleId = null
        draft.cycles[currentCycleIndex].interruptDate = new Date()
      })
    }
    case ActionTypes.FINISH: {
      const currentCycleIndex = state.cycles.findIndex(
        (cycle) => cycle.id === state.activeCycleId,
      )

      if (currentCycleIndex < 0) return state

      return produce(state, (draft) => {
        draft.activeCycleId = null
        draft.cycles[currentCycleIndex].finishedDate = new Date()
      })
    }
    default:
      return state
  }
}
