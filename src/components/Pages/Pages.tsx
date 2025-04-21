import React, {useContext} from "react"
import {observer} from 'mobx-react-lite'
import {Context} from "../../index";
import {Pagination} from "react-bootstrap";
import s from './Pages.module.scss'


interface PagesProps {
    state: any;
}

const Pages = observer(({ state }: PagesProps) => {
    const pageCount = Math.ceil(state.total_count / state.limit)
    const pages = []

    for(let i = 0; i < pageCount; i++){
        pages.push(i + 1)
    }

    if (pageCount <= 10){
        return(
            <Pagination className={s.pagination}>
                {pages.map(page =>
                    <Pagination.Item
                        className={s.item}
                        key={page}
                        active={state.page === page}
                        onClick={() => state.setPage(page)}
                    >
                        {page}
                    </Pagination.Item>
                )}
            </Pagination>
        )
    }
    else if (state.page == 1 || state.page == 2){
        return(
            <Pagination className={s.pagination}>
                    <Pagination.Item
                        className={s.item}
                        key={1}
                        active={state.page === 1}
                        onClick={() => state.setPage(1)}
                    >
                        {1}
                    </Pagination.Item>
                <Pagination.Item
                    className={s.item}
                    key={2}
                    active={state.page === 2}
                    onClick={() => state.setPage(2)}
                >
                    {2}
                </Pagination.Item>
                <Pagination.Item
                    className={s.item}
                    key={3}
                    active={state.page === 3}
                    onClick={() => state.setPage(3)}
                >
                    {3}
                </Pagination.Item>
                <Pagination.Item
                    className={s.disabledItem}
                    disabled
                >
                    {'...'}
                </Pagination.Item>
                <Pagination.Item
                    className={s.item}
                    key={pageCount}
                    active={state.page === pageCount}
                    onClick={() => state.setPage(pageCount)}
                >
                    {pageCount}
                </Pagination.Item>

            </Pagination>
        )
    } else if (state.page == pageCount || state.page == pageCount-1){
        return(
            <Pagination className={s.pagination}>
                <Pagination.Item
                    className={s.item}
                    key={1}
                    active={state.page === 1}
                    onClick={() => state.setPage(1)}
                >
                    {1}
                </Pagination.Item>
                <Pagination.Item
                    className={s.disabledItem}
                    disabled
                >
                    {'...'}
                </Pagination.Item>
                <Pagination.Item
                    className={s.item}
                    key={pageCount-2}
                    active={state.page === pageCount-2}
                    onClick={() => state.setPage(pageCount-2)}
                >
                    {pageCount-2}
                </Pagination.Item>
                <Pagination.Item
                    className={s.item}
                    key={pageCount-1}
                    active={state.page === pageCount-1}
                    onClick={() => state.setPage(pageCount-1)}
                >
                    {pageCount-1}
                </Pagination.Item>
                <Pagination.Item
                    className={s.item}
                    key={pageCount}
                    active={state.page === pageCount}
                    onClick={() => state.setPage(pageCount)}
                >
                    {pageCount}
                </Pagination.Item>

            </Pagination>
        )
    } else {
        return(
            <Pagination className={s.pagination}>
                <Pagination.Item
                    className={s.item}
                    key={1}
                    active={state.page === 1}
                    onClick={() => state.setPage(1)}
                >
                    {1}
                </Pagination.Item>
                <Pagination.Item
                    className={s.disabledItem}
                    disabled
                >
                    {'...'}
                </Pagination.Item>
                <Pagination.Item
                    className={s.item}
                    key={state.page-1}
                    onClick={() => state.setPage(state.page-1)}
                >
                    {state.page-1}
                </Pagination.Item>
                <Pagination.Item
                    className={s.item}
                    key={state.page}
                    active
                >
                    {state.page}
                </Pagination.Item>
                <Pagination.Item
                    className={s.item}
                    key={state.page+1}
                    onClick={() => state.setPage(state.page+1)}
                >
                    {state.page+1}
                </Pagination.Item>
                <Pagination.Item
                    className={s.disabledItem}
                    disabled
                >
                    {'...'}
                </Pagination.Item>
                <Pagination.Item
                    className={s.item}
                    key={pageCount}
                    active={state.page === pageCount}
                    onClick={() => state.setPage(pageCount)}
                >
                    {pageCount}
                </Pagination.Item>

            </Pagination>
        )
    }
})

export default Pages