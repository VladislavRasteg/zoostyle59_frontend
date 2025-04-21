import React, {useEffect, useState} from "react";
import s from './UserRoles.module.scss'
import { iUserRole } from "../../interfaces/interfaces";
import { Button } from "../../shared/Button";
import CreateUserRoleModal from "./CreateUserRoleModal/CreateUserRoleModal";

const UserRoles = () => {
    const [showCreateRoleModal, setShowCreateRoleModal] = useState(false)
    const [userRoles, setUserRoles] = useState(Array<iUserRole>)

    useEffect(() => {
        console.log("user roles")
    }, [])

    return (
        <>
            {showCreateRoleModal && <CreateUserRoleModal show={showCreateRoleModal} setShow={setShowCreateRoleModal} name="Создание роли" mode="create" />}

            <div className={s.table_buttons_wrapper}>
                <Button theme="secondary" onClick={() => setShowCreateRoleModal(true)}>Добавить роль</Button>
                <div className={s.table_wrapper}>
                    <div className={s.table}>
                        <table>
                            <thead>
                                <tr className={s.trh}>
                                    <th  className={s.tdh}>Название роли</th>
                                </tr>
                            </thead>
                            <tbody className={s.tb}>
                                {userRoles && userRoles.map((role: any) =>
                                    <tr className={s.trb}>
                                        <td className={s.tdb}>{role.name}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* <Pages /> сюда */}
                </div>
            </div>
        </>
    )
}

export default UserRoles