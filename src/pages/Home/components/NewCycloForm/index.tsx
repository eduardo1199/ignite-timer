import { FormContainer, MinutesAmountInput, TaskInput } from './styles'

import { useForm } from 'react-hook-form'

import * as zod from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod
    .number()
    .min(1, 'O intervalo precisa ser no mínimo 5 minutos.')
    .max(60, 'O intervalo precisa ser no máximo 60 minutos.'),
})
type NewCycloData = zod.infer<typeof newCycleFormValidationSchema>

export function NewCycloForm() {
  const { register, handleSubmit, watch, reset } = useForm<NewCycloData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  })

  const task = watch('task')

  const isSubmitDisabled = !task

  return (
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
  )
}
