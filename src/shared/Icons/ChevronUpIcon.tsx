import { SizedIconLayout } from "../SizedIconLayout";


interface IconProps{
    size?: number;
    fill?: string;
    className?: string;
}

export const ChevronUpIcon = (props: IconProps) => {

    const {fill = "#000000", className} = props;

    let iconColor = fill

    if(fill.startsWith("--")){
        const bodyStyles = window.getComputedStyle(document.body);
        iconColor = bodyStyles.getPropertyValue(fill);
    }

    return(
        <SizedIconLayout iconProps={props}>
            <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.42731 7.31509C4.1262 6.60219 5.2289 6.53535 6.00478 7.12259L6.03856 7.14816L6.19415 7.28516L12.0024 13.2101L17.7812 7.31511C18.4801 6.60221 19.5828 6.53535 20.3587 7.12259L20.3925 7.14816L20.548 7.28515L20.5774 7.31509C21.2676 8.01919 21.3264 9.1091 20.7652 9.88057L20.7405 9.91453L20.6067 10.0727L13.4004 17.4234C12.7016 18.1363 11.5989 18.2032 10.823 17.6159L10.7892 17.5903L10.6336 17.4533L3.42731 10.1025C2.67022 9.33025 2.67022 8.08737 3.42731 7.31509Z" transform="rotate(180 12 12)" fill={iconColor} className={className}/>
            </svg>
        </SizedIconLayout>
    )
}