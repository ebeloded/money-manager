import 'bootstrap/dist/css/bootstrap.min.css'
import { css } from 'emotion'
import * as React from 'react'
import styled from 'react-emotion'

export const Form = styled('form')``

export const Fieldset = styled('fieldset')`
  border: solid 1px #eee;
`

export const Legend = styled('legend')``

export const FormGroup = styled('div')``

const formControl = ({ theme }) => css``

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onChangeValue: (value: string) => void
}
export class Input extends React.PureComponent<InputProps> {
  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { onChange, onChangeValue } = this.props
    if (onChange) {
      onChange(event)
    }
    if (onChangeValue) {
      onChangeValue(event.currentTarget.value)
    }
  }

  render() {
    const { onChangeValue, ...rest } = this.props
    return <input className="" {...rest} onChange={this.handleChange} />
  }
}

export const Label = styled('label')``

export const Button = styled('button')`
  ${formControl};
`

export const Select = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => <select {...props} />

export const Option = (props: React.OptionHTMLAttributes<HTMLOptionElement>) => <option {...props} />
