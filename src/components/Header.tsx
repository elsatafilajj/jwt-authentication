import logo from "../assets/logo.png";

const Header = () => {
  return (
    <header className="h-16 px-6 bg-white shadow flex items-center">
      <img className="max-w-44 h-auto" src={logo} alt="Logo" />
    </header>
  );
};

export default Header;
