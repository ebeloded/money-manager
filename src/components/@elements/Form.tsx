// import 'bootstrap/dist/css/bootstrap.min.css'
import * as React from 'react'
import styled from 'react-emotion'
import { Button as MaterialButton } from 'rmwc/Button'
import { FormField as MaterialFormField } from 'rmwc/FormField'
import { Select as MaterialSelect } from 'rmwc/Select'
import { TextField as MaterialTextField } from 'rmwc/TextField'

export const Form = styled('form')``

export const Fieldset = styled('fieldset')``

export const Legend = styled('legend')``

const join = (...classes: Array<string | undefined>) => classes.filter((v) => v).join(' ')

export const FormField = MaterialFormField

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onChangeValue: (value: string) => void
  outlined?: boolean
  box?: boolean
  label?: string
  fullwidth?: boolean
  inputRef?: React.Ref<HTMLInputElement>
}

export class TextField extends React.Component<TextFieldProps> {
  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { onChange, onChangeValue } = this.props
    if (onChange) {
      onChange(event)
    }
    if (onChangeValue) {
      onChangeValue(event.target.value)
    }
  }

  render() {
    const { onChangeValue, ...rest } = this.props
    return <MaterialTextField onChange={this.handleChange} {...rest} />
  }
}

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
      onChangeValue(event.target.value)
    }
  }

  render() {
    const { onChangeValue, className, ...rest } = this.props
    return <input className={join('form-control', className)} onChange={this.handleChange} {...rest} />
  }
}

export const Button = (props) => <MaterialButton {...props} />

export const Select = (props) => <MaterialSelect {...props} />

export const Option = (props: React.OptionHTMLAttributes<HTMLOptionElement>) => <option {...props} />
