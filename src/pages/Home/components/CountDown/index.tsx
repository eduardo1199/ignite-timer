import { differenceInSeconds } from 'date-fns'
import { useContext, useEffect, useState } from 'react'
import { CyclesContext } from '../..'
import { CountDownContainer, Separator } from './styles'

export function CountDown() {
  const { activeCycle, activeCycleId, markCurrentCycleAsFinished } =
    useContext(CyclesContext)

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  const totalSecondsCycle = activeCycle?.id ? activeCycle.minutesAmount * 60 : 0

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

  useEffect(() => {
    let interval: number

    if (activeCycle?.id) {
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(
          new Date(),
          activeCycle.startDate,
        )

        if (secondsDifference >= totalSecondsCycle) {
          markCurrentCycleAsFinished()

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
  }, [
    activeCycle,
    totalSecondsCycle,
    activeCycleId,
    markCurrentCycleAsFinished,
  ])

  return (
    <CountDownContainer>
      <span>{minutes[0]}</span>
      <span>{minutes[1]}</span>
      <Separator>:</Separator>
      <span>{seconds[0]}</span>
      <span>{seconds[1]}</span>
    </CountDownContainer>
  )
}
