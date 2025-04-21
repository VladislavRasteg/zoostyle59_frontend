import './PhoneInput.scss'
import PhoneInput, { Value } from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

interface IPhoneInput{
    value: string | undefined
    onChange: (value?: Value) => void
    className?: string
}

export const CustomPhoneInput = ({value, onChange, className}: IPhoneInput) => {
    return(
        <PhoneInput 
            international
            autoComplete='no'
            defaultCountry="RU"
            value={value}
            onChange={onChange}
            className={className as string}
        />
    )
}