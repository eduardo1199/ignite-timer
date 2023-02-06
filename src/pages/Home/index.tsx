import { useEffect, useState } from 'react'

import { HandPalm, Play } from 'phosphor-react'

import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'

import { differenceInSeconds } from 'date-fns'

import {
  CountDownContainer,
  FormContainer,
  HomeContainer,
  MinutesAmountInput,
  Separator,
  StartCountDownButton,
  TaskInput,
  StopCountDownButton,
} from './styles'

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod
    .number()
    .min(1, 'O intervalo precisa ser no mínimo 5 minutos.')
    .max(60, 'O intervalo precisa ser no máximo 60 minutos.'),
})

interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptDate?: Date
  finishedDate?: Date
}

type NewCycloData = zod.infer<typeof newCycleFormValidationSchema>

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  const { register, handleSubmit, watch, reset } = useForm<NewCycloData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  })

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId) // get cycle active

  const totalSecondsCycle = activeCycle?.id ? activeCycle.minutesAmount * 60 : 0 // if exist active cycle, transform the minutes amount in seconds

  useEffect(() => {
    let interval: number

    if (activeCycle?.id) {
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(
          new Date(),
          activeCycle.startDate,
        )

        if (secondsDifference >= totalSecondsCycle) {
          setCycles((cycles) =>
            cycles.map((cycle) => {
              if (cycle.id === activeCycle?.id) {
                return {
                  ...cycle,
                  finishedDate: new Date(),
                }
              } else {
                return cycle
              }
            }),
          )

          setAmountSecondsPassed(totalSecondsCycle)
          clearInterval(interval)
        } else {
          setAmountSecondsPassed(secondsDifference)
        }
      }, 1000)
    }

    return () => {
      clearInterval(interval)
    }
  }, [activeCycle, totalSecondsCycle])

  function handleCreateNewCycle(data: NewCycloData) {
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
  }

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

  const task = watch('task') // monitor variable task
  const isSubmitDisabled = !task

  const currentSecondsCycle = activeCycle?.id // id exist active cycle, subtract seconds current amount with seconds passed
    ? totalSecondsCycle - amountSecondsPassed
    : 0

  const minutesAmount = Math.floor(currentSecondsCycle / 60) // get current minutes
  const secondsAmount = currentSecondsCycle % 60 // get current seconds

  const minutes = String(minutesAmount).padStart(2, '0')
  const seconds = String(secondsAmount).padStart(2, '0')

  useEffect(() => {
    if (activeCycle?.id) {
      document.title = `${minutes}:${seconds}`
    }
  }, [minutes, seconds, activeCycle])

  return (
    <HomeContainer>
      <form action="" onSubmit={handleSubmit(handleCreateNewCycle)}>
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
          <TaskInput
            type="text"
            id="task"
            placeholder="Dê um nome para o seu projeto"
            list="task-suggestion"
            disabled={!!activeCycle?.id}
            {...register('task')}
          />

          <datalist id="task-suggestion">
            <option value="projeto 1" />
          </datalist>

          <label htmlFor="minutesAmount">durante</label>
          <MinutesAmountInput
            type="number"
            id="minutesAmount"
            placeholder="00"
            step={5}
            min={1}
            max={60}
            disabled={!!activeCycle?.id}
            {...register('minutesAmount', { valueAsNumber: true })}
          />

          <span>minutos.</span>
        </FormContainer>

        <CountDownContainer>
          <span>{minutes[0]}</span>
          <span>{minutes[1]}</span>
          <Separator>:</Separator>
          <span>{seconds[0]}</span>
          <span>{seconds[1]}</span>
        </CountDownContainer>

        {activeCycle?.id ? (
          <StopCountDownButton type="button" onClick={handleInterruptCycle}>
            <HandPalm size={24} />
            Interromper
          </StopCountDownButton>
        ) : (
          <StartCountDownButton disabled={isSubmitDisabled} type="submit">
            <Play size={24} />
            Começar
          </StartCountDownButton>
        )}
      </form>
    </HomeContainer>
  )
}
