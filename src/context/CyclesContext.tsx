import { createContext, ReactNode, useReducer, useState } from 'react'

import { CreateCycleData, Cycle, CycleContextData } from '../@types/styled'

export const CyclesContext = createContext({} as CycleContextData)

interface CyclesContextProviderProps {
  children: ReactNode
}

interface CyclesState {
  cycles: Cycle[]
  activeCycleId: string | null
}

export function CyclesContextProvider({
  children,
}: CyclesContextProviderProps) {
  const [cyclesState, dispatch] = useReducer(
    (state: CyclesState, action: any) => {
      if (action.type === 'add') {
        return {
          activeCycleId: action.payload.data.id,
          cycles: [...state.cycles, action.payload.data],
        }
      }

      if (action.type === 'interrupt') {
        return {
          activeCycleId: null,
          cycles: state.cycles.map((cycle) => {
            if (cycle.id === action.payload.id) {
              return {
                ...cycle,
                interruptDate: new Date(),
              }
            } else {
              return cycle
            }
          }),
        }
      }

      if (action.type === 'finish') {
        return {
          ...state,
          cycles: state.cycles.map((cycle) => {
            if (cycle.id === action.payload.id) {
              return {
                ...cycle,
                finishedDate: new Date(),
              }
            } else {
              return cycle
            }
          }),
        }
      }

      return state
    },
    {
      cycles: [],
      activeCycleId: null,
    },
  )
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  const { cycles, activeCycleId } = cyclesState

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

    setAmountSecondsPassed(0)
  }

  function interruptCurrentCycle() {
    dispatch({
      type: 'interrupt',
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
