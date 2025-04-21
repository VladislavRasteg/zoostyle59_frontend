import React, { type ButtonHTMLAttributes, type FC } from 'react'
import s from './Button.module.scss'
import { classNames } from '../../lib/classNames/classNames'


interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
  theme?: string
  iconOnly?: boolean
  fullWidth?: boolean
  disabled?: boolean
  size?: "default" | "small" | "big"
}

export const Button: FC<ButtonProps> = (props) => {
  const { className, children, disabled = false, size = "default", theme = "primary", iconOnly = false, fullWidth = false, ...otherProps } = props

  return (
      <button
        type = 'button'
        className={classNames(s.button, { [s.disabled]: disabled, [s.iconOnly]: iconOnly, [s.fullWidth]: fullWidth }, [className as string, s[theme], s[size]])}
        {...otherProps}
    >
          {children}
      </button>
  )
}
