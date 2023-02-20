import { CyclesState } from '../../@types/styled'
import { ActionTypes } from './actions'

export function cylesReducer(state: CyclesState, action: any) {
  switch (action.type) {
    case ActionTypes.add:
      return {
        activeCycleId: action.payload.data.id,
        cycles: [...state.cycles, action.payload.data],
      }
    case ActionTypes.interrupt:
      return {
        activeCycleId: null,
        cycles: state.cycles.map((cycle) => {
          if (cycle.id === state.activeCycleId) {
            return {
              ...cycle,
              interruptDate: new Date(),
            }
          } else {
            return cycle
          }
        }),
      }
    case ActionTypes.finish:
      return {
        activeCycleId: null,
        cycles: state.cycles.map((cycle) => {
          if (cycle.id === state.activeCycleId) {
            return {
              ...cycle,
              finishedDate: new Date(),
            }
          } else {
            return cycle
          }
        }),
      }
    default:
      return state
  }
}
