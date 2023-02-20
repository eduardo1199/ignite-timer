import { createContext, ReactNode, useReducer, useState } from 'react'

import { CreateCycleData, Cycle, CycleContextData } from '../@types/styled'
import { ActionTypes, cylesReducer } from '../reducers/cycles'

export const CyclesContext = createContext({} as CycleContextData)

interface CyclesContextProviderProps {
  children: ReactNode
}

export function CyclesContextProvider({
  children,
}: CyclesContextProviderProps) {
  const [cyclesState, dispatch] = useReducer(cylesReducer, {
    cycles: [],
    activeCycleId: null,
  })

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  const { cycles, activeCycleId } = cyclesState

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId) // get cycle active

  function markCurrentCycleAsFinished() {
    dispatch({
      type: ActionTypes.finish,
      payload: {
        data: activeCycle?.id,
      },
    })
  }

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }

  function createNewCycle(data: CreateCycleData) {
    const id = String(new Date().getTime())

    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    dispatch({
      type: ActionTypes.add,
      payload: {
        data: newCycle,
      },
    })

    setAmountSecondsPassed(0)
  }

  function interruptCurrentCycle() {
    dispatch({
      type: ActionTypes.interrupt,
      payload: {
        id: activeCycle?.id,
      },
    })
  }

  return (
    <CyclesContext.Provider
      value={{
        activeCycle,
        activeCycleId,
        markCurrentCycleAsFinished,
        amountSecondsPassed,
        setSecondsPassed,
        createNewCycle,
        interruptCurrentCycle,
        cycles,
      }}
    >
      {children}
    </CyclesContext.Provider>
  )
}
