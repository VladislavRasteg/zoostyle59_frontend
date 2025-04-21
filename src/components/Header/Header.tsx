import React, {useContext} from "react";
import s from './Header.module.scss'
import {Context} from "../../index";
import {observer} from "mobx-react-lite";

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
    if(context) {
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

const Header = observer(() => {
    const {user} = useContext(Context)
    return(
        <div className={s.header}>
            <div className={s.user_wrapper}>
                <img alt="Avatar" id="avatar" src = {generateAvatar(user.login[0].toUpperCase(), "white", ["#D3E5FF", "#F6FAFF"])} />
                <div className={s.user}>
                    {user.isAdmin ? <p>Администратор</p> : <p>Врач</p>}
                    <p style={{fontSize: 18, fontWeight: 500}}>{user.login}</p>
                </div>
            </div>
        </div>
    )
})

export default Header