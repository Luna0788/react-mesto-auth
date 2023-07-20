import logoPath from '../images/logo.svg';

function Header() {
return (
    <header className="header">
      <img src={logoPath} alt="Логотип Mesto" className="logo"/>
    </header>
);
}

export default Header;