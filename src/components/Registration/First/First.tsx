import React, {useEffect, useState} from 'react';
import {Button} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import s from "../Registration.module.scss";
import {createRegistration} from "../../../http/registrationAPI"
import {Scrollbar} from 'react-scrollbars-custom';
import ym from 'react-yandex-metrika';
import {Title} from "@/shared/Title";
import {Input} from "@/shared/Input";
import {PhoneInput} from "@/shared/PhoneInput";
import {Notification} from "@arco-design/web-react";

const First = () => {

  useEffect(() => {
    ym('hit', '/registration');
  }, []);

  const [details, setDetails] = useState({country_name: 'nope', state: 'nope', city: 'nope', IPv4: '192.168.0.253'})

  const [name, setName] = useState<string>('')
  const [phone, setPhone] = useState<string>()
  const [mail, setMail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const navigate = useNavigate()

  const onSubmit = async () => {
    if(password?.length < 3) {
      return(Notification.error({
        title: 'Ошибка',
        content: 'Пароль должен содержать как минимум 8 символов, одну заглавную букву и цифру.',
      }))
    }
    const offsetInMinutes = new Date().getTimezoneOffset();
    const timezone = -offsetInMinutes / 60;
    await createRegistration(name, phone as string, mail, password, details?.IPv4 || '', `${details?.country_name} ${details?.state} ${details?.city}`, timezone)
      .then((data: any) => {
        ym('reachGoal', 'reg1')
        navigate(`/registration/second/${data.link}`)
      })
      .catch((e: any) => {
        console.log(e)
        Notification.error({
          title: 'Ошибка',
          content: e.response.data.message || e.message,
        })
      })
  }

  return (
    <div className={s.registration_background}>
      <div className={s.card_container}>
        <h3>Регистрация</h3>
        <Scrollbar style={{height: "100%", maxHeight: 600, width: "100%"}}>
          <div className={s.fields_group}>
            <Title className={s.field_title} title="Ваше имя" required/>
            <Input placeholder="Имя" offAutoComplite value={name} onChange={setName}/>
            <br></br>
            <Title className={s.field_title} title="Ваш телефон" required/>
            <PhoneInput value={phone} onChange={setPhone}/>
            <br></br>
            <Title className={s.field_title} title="Ваша почта" required/>
            <Input type='email' placeholder="example@email.ru" offAutoComplite value={mail} onChange={setMail}/>
            <br></br>
            <Title className={s.field_title} title="Ваш пароль" required/>
            <Input type='password' placeholder="Ваш пароль" offAutoComplite value={password} onChange={setPassword}/>
            {/*<p style={{fontWeight: 400, fontSize: 14, padding: 0, margin: 0, marginTop: 12}}>*/}
            {/*  Пароль должен содержать как минимум 8 символов, а также, одну заглавную букву и цифру.*/}
            {/*</p>*/}

            <Button
              disabled={!name || !mail || !phone || !password}
              style={{height: 60, marginTop: 26, width: "100%"}}
              className={s.next_step_button}
              variant={"primary"}
              onClick={onSubmit}
            >
              <p style={{
                fontFamily: 'Inter',
                fontWeight: 400,
                fontSize: 16,
                padding: 0,
                margin: 0
              }}>Следующий шаг</p>
            </Button>
          </div>
        </Scrollbar>
      </div>
    </div>
  )
}

export default First;
