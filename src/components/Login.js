import React from 'react';
import UserDataForm from "./UserDataForm";

function Login() {
    const [formValue, setFormValue] = React.useState({
        email: '',
        password: ''
    });

    function onChange(e) {
        const {name, value} = e.target;

        setFormValue({
            ...formValue,
            [name]: value
        });
    }

    return (
         <UserDataForm 
            title={"Вход"}
            formName={"signin"}
            buttonText={"Войти"}
            formValue={formValue}
            onChange={onChange}
         />
    )
}

export default Login;