// import 'bootstrap/dist/css/bootstrap.min.css'
import { css } from 'emotion'
import * as React from 'react'
import styled from 'react-emotion'

export const Form = styled('form')``

export const Fieldset = styled('fieldset')``

export const Legend = styled('legend')``

const join = (...classes: Array<string | undefined>) => classes.filter((v) => v).join(' ')

export const FormGroup = ({ children, className, ...props }: React.InputHTMLAttributes<HTMLDivElement>) => (
  <div {...props} className={join(className, 'form-group')}>
    {children}
  </div>
)

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
    const { onChangeValue, className, ...rest } = this.props
    return <input className={join('form-control', className)} onChange={this.handleChange} {...rest} />
  }
}

export const Button = ({ className, ...props }: React.InputHTMLAttributes<HTMLButtonElement>) => (
  <button {...props} className={join('btn', className)} />
)

export const Label = styled('label')``

export const Select = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => <select {...props} />

export const Option = (props: React.OptionHTMLAttributes<HTMLOptionElement>) => <option {...props} />
