import React from "react";
import logoPath from '../images/logo.svg';
import { Link, Route, Routes } from "react-router-dom";

function Header() {
return (
    <header className="header">
      <img src={logoPath} alt="Логотип Mesto" className="logo"/>
      <Routes>
        <Route path="/sign-in" element={
          <Link to="/sign-up" className="link">
            Регистрация
          </Link>
        }/>

        <Route path="/sign-up" element={
          <Link to="/sign-in" className="link">
            Вход
          </Link>
        } />

        <Route exact path="/" element={
          <Link to="/sign-in" className="link">
            Выйти
          </Link>
        } />
      </Routes>
        

      
      
    </header>
);
}

export default Header;