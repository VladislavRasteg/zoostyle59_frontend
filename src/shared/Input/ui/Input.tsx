import {FC, HTMLInputTypeAttribute, InputHTMLAttributes} from 'react'
import s from './Input.module.scss'
import { classNames } from '@/shared/lib/classNames/classNames'

interface IInput extends InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string
  type?: HTMLInputTypeAttribute
  offAutoComplite?: boolean
  value?: string | number
  disabled?: boolean
  onChange?: (value: any) => void
}

export const Input: FC<IInput> = (props) => {
  const {placeholder = "", type = "text", value, disabled = false, onChange, offAutoComplite = false, ...otherProps} = props
  return (
    <input
      {...otherProps}
      onFocus={(e) => e.target.setAttribute("autoComplete", "none")}
      className={classNames(s.input, {[s.disabled]: disabled})}
      placeholder={placeholder}
      type={type}
      value={value}
      disabled={disabled}
      autoComplete={String(!offAutoComplite)}
      onChange={(e) => onChange && onChange(e.target.value)}/>
  )

}