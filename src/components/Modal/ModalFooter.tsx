import { FC } from "react";
import s from "./Modal.module.scss"

interface ModalFooterProps{
    children: any;
};

const ModalFooter: FC<ModalFooterProps> = (props) => {
    const {children} = props
    return(
        <div className={s.modal_footer}>
            {children}
        </div>
    )
}

export default ModalFooter;