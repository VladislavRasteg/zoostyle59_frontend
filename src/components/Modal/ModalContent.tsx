import { FC } from "react";
import s from "./Modal.module.scss"
import { Scrollbar } from "react-scrollbars-custom";

interface ModalContentProps{
    children: any;
    height?: number | string
    width?: string
};

const ModalContent: FC<ModalContentProps> = (props) => {
    const {children, height, width} = props
    return(
        <Scrollbar style={{width: width || "100%", height: height || 400, maxHeight: "80vh"}}>
            <div className={s.modal_content}>
                {children}
            </div>
        </Scrollbar>
    )
}

export default ModalContent;