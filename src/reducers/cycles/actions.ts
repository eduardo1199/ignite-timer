import { Cycle } from '../../@types/styled'

export enum ActionTypes {
  add = 'add',
  interrupt = 'interrupt',
  finish = 'finish',
}

export function addNewCycleAction(newCycle: Cycle) {
  return {
    type: ActionTypes.add,
    payload: {
      data: newCycle,
    },
  }
}

export function interruptCurrentCycleAction() {
  return {
    type: ActionTypes.interrupt,
  }
}

export function markCurrentCycleAsFinishedAction() {
  return {
    type: ActionTypes.finish,
  }
}
