import React, {useRef, useEffect, useState} from "react"
import {motion, useInView, useAnimation} from "framer-motion"
import s from "./Reveal.module.scss"

interface Props {
    children: React.ReactNode;
    width?: "fit-content" | "100%";
    delay?: number;
    duration?: number;
    layout?: boolean;
}

export const Reveal:React.FC<Props> = ({children, width = "100%", delay = 0.2, duration = 0.4,  layout}) => {
    const ref = useRef(null)
    const isInView = useInView(ref, {once: true})

    const [style, setStyle] = useState("reveal-relative reveal-hidden")

    const mainControls = useAnimation()

    useEffect(() => {
        if (isInView) {
            mainControls.set("hidden")
            mainControls.start("visible")
            setTimeout(() => {
                setStyle("reveal-relative")
            }, 750)
        }
    }, [isInView, layout])

    return (
        <div ref={ref} style={{width}} className={s[style]}>
        <motion.div
        variants={{
            hidden: {opacity: 0, y: 100},
            visible: {opacity: 1, y: 0},
        }}
        initial="hidden"
        animate={mainControls}
        transition={{ duration, delay }}
        >{children}</motion.div>
        </div>
    )
};
