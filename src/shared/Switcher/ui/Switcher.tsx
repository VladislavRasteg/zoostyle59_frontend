import s from './Switcher.module.scss'
import { MouseEvent } from 'react';


interface SwitcherProps {
  setValue?: any
  value?: any
}

export const Switcher = ({value, setValue} : SwitcherProps) => 
  {

    const clickHandler = (event: MouseEvent<HTMLDivElement>) => {
      event.stopPropagation(); 
      setValue(!value)
    }

    return(
      <div className={value ? `${s.toggleSwitch} ${s.active}` : s.toggleSwitch} onClick={(event) => {clickHandler(event)}}>
          <div className={s.toggleCircle}>
          </div>
      </div>
    )
  }
