import { FC } from "react";
import s from "./Modal.module.scss"
import {motion} from "framer-motion"
import {ReactComponent as CloseIcon} from "./assets/close_24px.svg"
import {ReactComponent as DeleteIcon} from "./assets/delete_24px.svg"
import { Button } from "../../shared/Button";
import ReactDom from "react-dom"

interface ModalProps{
    show: boolean;
    setShow?: (show: boolean) => void;
    onClose?: () => void;
    name: string;
    children: any;
    onDelete?: () => void
    allowDelete?: boolean
};

const Modal: FC<ModalProps> = (props) => {
    const {children, show, setShow, onClose, name, allowDelete = false, onDelete} = props

    if (!show) return null

    const showBackdrop = {
    hidden: {
        opacity: 0,
    },
    visible: {
        opacity: 1,
        transition: {
        duration: 0.4,
        damping: 25,
        stiffness: 500,
        },
    },
    exit: {
        y: "100vh",
        opacity: 0,
    },
    };
    
    return ReactDom.createPortal(
        <motion.div
          variants={showBackdrop}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={s.aside_wrapper}
        //   onClick={() => {setShow && setShow(!show); onClose && onClose()}}
        >
            <div className={s.aside_body} onClick={(e) => {e.stopPropagation()}}>
                <div className={s.modal_header}>
                    <p className={s.modal_name}>{name}</p>
                    <div className={s.header_buttons}>
                        {allowDelete}
                        {allowDelete && <Button iconOnly theme="dangerous" onClick={() => {onDelete && onDelete()}} ><DeleteIcon className={s.deleteIcon} /></Button>}
                        <Button iconOnly theme="border" onClick={() => {setShow && setShow(!show); onClose && onClose()}} ><CloseIcon/></Button>
                    </div>
                </div>
                {children}
            </div>
        </motion.div>,
        document.body
    )
} 

export default Modal;