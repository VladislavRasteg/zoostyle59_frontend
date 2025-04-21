import { useState, useRef, useEffect } from "react";

export const useObserveElementDimensions = <T extends HTMLElement>() => {
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [top, setTop] = useState(0);
    const [left, setLeft] = useState(0);
    const ref = useRef<T>(null);

    const updateDimensions = () => {
        if (ref.current) {
            const rect = ref.current.getBoundingClientRect();
            setWidth(rect.width);
            setHeight(rect.height);
            setTop(rect.top);
            setLeft(rect.left);
        }
    };

    useEffect(() => {
        const resizeObserver = new ResizeObserver(() => {
            updateDimensions();
        });

        const intersectionObserver = new IntersectionObserver(() => {
            updateDimensions();
        }, {threshold: 0});

        if (ref.current) {
            resizeObserver.observe(ref.current);
            intersectionObserver.observe(ref.current);
            // Initial call to set dimensions
            updateDimensions();
        }

        return () => {
            if (ref.current) {
                resizeObserver.unobserve(ref.current);
                intersectionObserver.unobserve(ref.current);
            }
        };
    }, []);

    return {
        width,
        height,
        top,
        left,
        ref
    };
};
