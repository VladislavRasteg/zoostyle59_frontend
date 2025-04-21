import { FC, AllHTMLAttributes } from "react"
import s from "./TitledBlock.module.scss"
import { classNames } from "@/shared/lib/classNames/classNames";

interface TitledBlockProps extends AllHTMLAttributes<HTMLDivElement>{
    title?: string;
    description?: string;
    className?: string;
}

export const TitledBlock:FC<TitledBlockProps> = (props) => {

    const { className, children, title, description, ...otherProps } = props

    return(
        <div 
            {...otherProps}
            className={classNames(s.titled_block, {}, [className as string])}
        >
            {
                (title || description) &&
                <div className={s.block_title}>
                    {title && <p className={s.title}>{title}</p>}
                    {description && <p className={s.description}>{description}</p>}
                </div>
            }
            {children}
        </div>
    )
}