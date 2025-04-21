import s from './Title.module.scss'
import { classNames } from "@/shared/lib/classNames/classNames";

interface ITitle{
    title: string;
    required?: boolean
    className?: string
}

export const Title = ({title, required=false, className}: ITitle) => {
    return(
        <p className={classNames(s.title, {[s.required]: required}, [className as string])}>{title}</p>
    )
}