import { FC, ReactNode } from "react";

interface IconProps{
    size?: number;
    className?: string;
}

interface ISizedIconLayout {
    iconProps: IconProps;
    children: ReactNode;
}

export const SizedIconLayout: FC<ISizedIconLayout> = ({iconProps, children}) => {
    const {size = 2.4} = iconProps;



    return(
        <div 
            style={{
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                width: `${size}rem`, 
                height: `${size}rem`,
            }}
        >
            {children}

        </div>
    )
}