import moment from 'moment'
import React from 'react'
import styled from 'react-emotion'

const StyledInput = styled('input')({
  border: 'solid 1px grey',
  fontSize: 12,
  padding: '5px',
})

export const Input = StyledInput

const onlyNumbersAllowed = (onChangeValue: (value: number) => void) => (event: React.FormEvent<HTMLInputElement>) => {
  const value: number = +event.currentTarget.value
  if (!isNaN(value) && value >= 0) {
    onChangeValue(value)
  }
}

export const NumberInput = ({ onChangeValue, value, ...props }) => (
  <Input {...props} value={value ? value.toString() : ''} onChange={onlyNumbersAllowed(onChangeValue)} />
)

const getDate = (onChangeDate: (value: Date) => void) => (event: React.FormEvent<HTMLInputElement>) => {
  const value = event.currentTarget.valueAsDate
  onChangeDate(value)
}

export const DateInput = ({ onChangeDate, value, ...props }) => {
  return <Input {...props} type="date" value={moment(value).format('YYYY-MM-DD')} onChange={getDate(onChangeDate)} />
}
