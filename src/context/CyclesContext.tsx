import { createContext, ReactNode, useReducer, useState } from 'react'

import { CreateCycleData, Cycle, CycleContextData } from '../@types/styled'

export const CyclesContext = createContext({} as CycleContextData)

interface CyclesContextProviderProps {
  children: ReactNode
}

export function CyclesContextProvider({
  children,
}: CyclesContextProviderProps) {
  const [cycles, dispatch] = useReducer((state: Cycle[], action: any) => {
    console.log(state, action)

    if (action.type === 'add') {
      return [...state, action.payload.data]
    }

    return state
  }, [])

  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId) // get cycle active

  function markCurrentCycleAsFinished() {
    dispatch({
      type: 'finish',
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
      type: 'add',
      payload: {
        data: newCycle,
      },
    })

    /* setCycles((state) => [...state, newCycle]) */
    setActiveCycleId(id)
    setAmountSecondsPassed(0)
  }

  function interruptCurrentCycle() {
    /* const newCyclesWithInterruptCycle = cycles.map((cycle) => {
      if (cycle.id === activeCycle?.id) {
        return {
          ...cycle,
          interruptDate: new Date(),
        }
      } else {
        return cycle
      }
    }) */

    dispatch({
      type: 'interrupt',
      payload: {
        data: activeCycle?.id,
      },
    })

    setActiveCycleId(null)
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
