import { createContext, useState } from 'react'

import { HandPalm, Play } from 'phosphor-react'

import {
  HomeContainer,
  StartCountDownButton,
  StopCountDownButton,
} from './styles'
// import { NewCycloForm } from './components/NewCycloForm'
import { CountDown } from './components/CountDown'

interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptDate?: Date
  finishedDate?: Date
}
interface CycleContextData {
  activeCycle: Cycle | undefined
  activeCycleId: string | null
  markCurrentCycleAsFinished: () => void
}

export const CyclesContext = createContext({} as CycleContextData)

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  // const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId) // get cycle active

  function markCurrentCycleAsFinished() {
    setCycles((cycles) =>
      cycles.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return {
            ...cycle,
            finishedDate: new Date(),
          }
        } else {
          return cycle
        }
      }),
    )
  }

  /*  function handleCreateNewCycle(data: NewCycloData) {
    const id = String(new Date().getTime())

    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    setCycles((state) => [...state, newCycle])
    setActiveCycleId(id)
    setAmountSecondsPassed(0)

    reset()
  } */

  function handleInterruptCycle() {
    const newCyclesWithInterruptCycle = cycles.map((cycle) => {
      if (cycle.id === activeCycle?.id) {
        return {
          ...cycle,
          interruptDate: new Date(),
        }
      } else {
        return cycle
      }
    })

    setCycles(newCyclesWithInterruptCycle)

    setActiveCycleId(null)
  }

  return (
    <HomeContainer>
      <form action="" /* onSubmit={handleSubmit(handleCreateNewCycle)} */>
        <CyclesContext.Provider
          value={{ activeCycle, activeCycleId, markCurrentCycleAsFinished }}
        >
          {/*  <NewCycloForm /> */}

          <CountDown />
        </CyclesContext.Provider>

        {activeCycle?.id ? (
          <StopCountDownButton type="button" onClick={handleInterruptCycle}>
            <HandPalm size={24} />
            Interromper
          </StopCountDownButton>
        ) : (
          <StartCountDownButton type="submit">
            <Play size={24} />
            Começar
          </StartCountDownButton>
        )}
      </form>
    </HomeContainer>
  )
}
