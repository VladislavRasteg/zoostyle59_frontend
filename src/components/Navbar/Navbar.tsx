import React, {useContext, useEffect, useState} from "react";
import s from './Navbar.module.scss'
import NavbarLink from "./NavLink/NavbarLink";
import {Context} from "../../index";
import {observer} from "mobx-react-lite";
import {ReactComponent as Logo} from "./assets/small_logo.svg"
import {ReactComponent as LogOut} from "./assets/logout.svg"
import {ReactComponent as PatientIcon} from "./assets/patients.svg"
import {ReactComponent as PetIcon} from "./assets/pet.svg"
import {ReactComponent as ReceptionsIcon} from "./assets/receptions.svg"
import {ReactComponent as CalendarIcon} from "./assets/calendar.svg"
import {ReactComponent as DoctorsIcon} from "./assets/doctors.svg"
import {ReactComponent as UsersIcon} from "./assets/users.svg"
import {ReactComponent as ProceduresIcon} from "./assets/procedures.svg"
import {Button} from "react-bootstrap";
import {ReactComponent as ZoostyleLogo} from '../../assets/logo.svg';
import {USERS_ROUTE} from "../../utils/consts";
import {fetchUserTenant} from "@/http/tenantAPI";

function generateAvatar(
  text: string,
  foregroundColor = "white",
  background: any
) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  canvas.width = 200;
  canvas.height = 200;

  // Draw background
  if (context) {
    const gr = context.createLinearGradient(50, 30, 150, 150);
    gr.addColorStop(0, background[0]);
    gr.addColorStop(1, background[1]);
    context.fillStyle = gr;
    context?.fillRect(0, 0, canvas.width, canvas.height);

    // Draw text
    context.font = "100px Inter";
    context.fillStyle = foregroundColor;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(text, canvas.width / 2, canvas.height / 2);
    // let ava = document.getElementById("avatar")
    // ava && (ava.setAttribute('src', canvas.toDataURL("image/png")))
    return canvas.toDataURL("image/png")
  }
}

const Navbar = observer(() => {
  const {user} = useContext(Context)

  const isMobile = window.innerWidth <= 500

  const [branchClass, setBranchClass] = useState(`${s.branch_wrapper}`)
  const [isActive, setIsActive] = useState(false)
  const [showBurgerMenu, setShowBurgerMenu] = useState(false)

  const logOut = () => {
    localStorage.setItem('token', '')
    user.setUser({})
    user.setIsAdmin(false)
    user.setIsAuth(false)
    user.setIsWaiter(false)
  }

  return (
    <div className={showBurgerMenu ? s.navWrapper : `${s.navWrapper} ${s.hidden}`}>
      <div className={s.navBurger}>
        <ZoostyleLogo className={s.header_logo}/>
        <button className={showBurgerMenu ? `${s.burger} ${s.expanded}` : s.burger} onClick={() => {
          setShowBurgerMenu(!showBurgerMenu)
        }}>
          <span className={s.bar_1}></span>
          <span className={s.bar_2}></span>
          <span className={s.bar_3}></span>
        </button>
      </div>
      <div className={showBurgerMenu ? s.nav : `${s.nav} ${s.hidden}`}>
        <div className={s.dividing}>
          <div className={s.nav_links}>
            <NavbarLink link='/' name='Календарь' icon={<CalendarIcon/>} close={setShowBurgerMenu}/>
            {!isMobile && <NavbarLink link='/receptions' name='Записи' icon={<ReceptionsIcon/>} close={setShowBurgerMenu}/>}
            {user.isAdmin && (
            <NavbarLink link='/clients' name='Клиенты' icon={<PatientIcon/>} close={setShowBurgerMenu}/> )}
            {user.isAdmin && (
            <NavbarLink link='/pets' name='Питомцы' icon={<PetIcon/>} close={setShowBurgerMenu}/> )}
            {user.isAdmin && (
              <NavbarLink link='/doctors' name='Сотрудники' icon={<DoctorsIcon/>} close={setShowBurgerMenu}/>)}
            {user.isAdmin && (
              <NavbarLink link='/procedures' name='Услуги' icon={<ProceduresIcon/>} close={setShowBurgerMenu}/>)}
            <Button variant="outline-danger" onClick={logOut} className={s.mobileQuitButton}>Выход</Button>
          </div>
        </div>
        <div className={s.user_wrapper}>
          <div className={s.img_name}>
            <img alt="Avatar" id="avatar"
                 src={generateAvatar(user.user.surname[0].toUpperCase(), "#5E2A0D", ["#FFBF76", "#FFCE96"])}/>
            <div className={s.user}>
              {user.isAdmin ? <p>Администратор</p> : <p>Сотрудник</p>}
              <p style={{fontSize: 18, fontWeight: 500}}>{user.user.name}</p>
            </div>
          </div>

          <button className={s.logout_button} onClick={logOut}><LogOut className={s.logout_icon}/></button>
        </div>
      </div>
    </div>

  )
})

export default Navbar