import React, {createRef, useContext, useEffect, useRef, useState} from "react";
import s from "./Multiselect.module.scss"
import {ReactComponent as DeleteIcon} from "./assets/DeleteIcon.svg"
import { Dropdown } from "react-bootstrap";
import { ClickAwayListener } from "@mui/base/"
import { Checkbox } from "@arco-design/web-react";
import ReactDOM from 'react-dom';
import { useObserveElementDimensions } from "@/hooks/useWidthObserver";

interface MultiselectProps {
    placeholder: string;
    displayValue: string;
    secondaryDisplayValue?: string;
    secondaryDisplayValueName?: string;
    onRemove: (selectedList: any) => void;
    onSelect: (selectedList: any) => void;
    selectedValues: object[];
    matchValue: string; //object key name for compare objects
    options: any[];
    mobileHeading?: string;
}

const Multiselect = ({placeholder, displayValue, secondaryDisplayValue, secondaryDisplayValueName, onRemove, onSelect, options, selectedValues, matchValue, mobileHeading = ''}: MultiselectProps) => {

    const [show, setShow] = useState(false)
    const [update, setUpdate] = useState(false)

    const [search, setSearch] = useState<string>("")

    const inputRef = useRef<HTMLInputElement>(null)

    const [filteredOptions, setFilteredOptions] = useState<any[]>()

    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [top, setTop] = useState(0);
    const [left, setLeft] = useState(0);

    const [isMobile, setIsMobile] = useState(window.innerWidth < 500 ? true : false)

    useEffect(() => {
        setFilteredOptions(options)
    }, [options])

    const deleteHandler = (objectToDelete: object) => {
        const index = selectedValues.indexOf(objectToDelete)
        if (index > -1) {
            selectedValues.splice(index, 1);
        }
        onRemove(selectedValues)
        setUpdate(true)
    }

    const ref = useRef<HTMLDivElement>(null);

    const updateRect = () => {
        if (ref.current) {
            const rect = ref.current.getBoundingClientRect();
            setWidth(rect.width);
            setHeight(rect.height);
            setTop(rect.top);
            setLeft(rect.left);
        }
    }

    useEffect(() => {
        setUpdate(false)
        updateRect()
    }, [update])

    const clickHandler = (object: object) => {
        const index = selectedValues.indexOf(object)
        if (index > -1) {
            deleteHandler(object)
        } else {
            selectHandler(object)
        }
        if(!isMobile){
            inputRef.current?.focus()
        }
        // setTimeout(() => {updateRect()}, 200)
    }

    const selectHandler = (objectToAdd: object) => {
        selectedValues.push(objectToAdd)
        onSelect(selectedValues)
        setUpdate(true)
    }

    const isInArray = (array: any[], object: any):boolean => {
        for (var i = array.length - 1; i > -1; i--) {
            if (array[i][matchValue] === object[matchValue]) {
                return true;
            }
        }
        return false;
    }
    
    const handleShow = () => {
        updateRect()
        setShow(true)
    }

    const searchHandler = (searchString: string) => {
        setSearch(searchString)
        if(!searchString || searchString == ""){
            setFilteredOptions(options)
        } else {
            setFilteredOptions(options.filter(item => item[displayValue].toLowerCase().startsWith(searchString.toLowerCase())))
        }
    }

    return(
        <div className={s.multiselectWrapper} ref={ref}>
            {selectedValues && selectedValues.map((value: any) => {
                return(
                    <div className={s.value}>
                        {value[displayValue]}
                        <div className={s.deleteRow} onClick={() => deleteHandler(value)}>
                            <DeleteIcon className={s.delete} />
                        </div>
                    </div>
                )
            })}
            <div  className={s.input_wrapper} onClick={() => (handleShow())}>
                <input autoComplete="true" className={s.input} ref={inputRef} placeholder={placeholder} value={search} onChange={(e) => searchHandler(e.target.value)} />
            </div>
            {show &&
                ReactDOM.createPortal(
                    <div className={s.menu_wrapper}>
                        <div className={s.menu_bg} onClick={() => setShow(false)}></div>
                        <div className={s.menu_heading} style={{left: left, top: top+height, width: width}}>
                            {mobileHeading && <div className={s.heading}>{mobileHeading}</div>}
                            <div className={s.menu_container}>
                                <div className={s.menu}>
                                    {filteredOptions && filteredOptions.map((value: any) =>
                                        <div className={s.menuItem} key={value[matchValue]} onClick={() => clickHandler(value)}>
                                            <Checkbox checked={isInArray(selectedValues, value)}/>
                                            <p>
                                                {value[displayValue]}
                                                {secondaryDisplayValue && 
                                                    <span className={s.secondaryDisplayValue}>
                                                        {` ${value[secondaryDisplayValue]} ${secondaryDisplayValueName ? secondaryDisplayValueName : ""}`}
                                                    </span>
                                                }
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div> 
                        </div>
                    </div>     
                    ,
                    document.body
                )
            }
        </div>
    )
}

export default Multiselect