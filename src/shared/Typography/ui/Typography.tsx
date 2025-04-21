import { type FC } from 'react'
import s from './Typography.module.scss'
import { TypographyProps } from '@arco-design/web-react'
import { classNames } from '@/shared/lib/classNames/classNames'


interface ITypographyProps extends TypographyProps {
  className?: string
  color?: "primary" | "secondary" | "invert" | "dangerous" | "brand"
  variant?: "h1" | "h2" | "h3" | "p1" | "p2" | "p3" | "p4"
  // wide?: boolean
  ref?: any
  children: any
}

export const Typography: FC<ITypographyProps> = (props) => {
  const { className, children, color = "primary", variant =  "p1", ref, ...otherProps } = props

  if(variant[0] === 'p'){
    return(
        <p
            className={classNames(s.typography, {}, [className as string, s[color], s[variant]])}
            {...otherProps}
            ref={ref}
        >
            {children}
        </p>
    )
  } else {
    return (
            <h1
                className={classNames(s.typography, {}, [className as string, s[color], s[variant]])}
                {...otherProps}
            >
                {children}
            </h1>
    )
    }
}
