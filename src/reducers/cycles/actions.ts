import { Cycle } from '../../@types/styled'

export enum ActionTypes {
  ADD = 'ADD',
  INTERRUPT = 'INTERRUPT',
  FINISH = 'FINISH',
}

export function addNewCycleAction(newCycle: Cycle) {
  return {
    type: ActionTypes.ADD,
    payload: {
      data: newCycle,
    },
  }
}

export function interruptCurrentCycleAction() {
  return {
    type: ActionTypes.INTERRUPT,
  }
}

export function markCurrentCycleAsFinishedAction() {
  return {
    type: ActionTypes.FINISH,
  }
}
