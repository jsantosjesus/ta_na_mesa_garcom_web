import { useContext, useState } from "react";
import { AuthContext } from "../../context/auth";
import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { MdLogout } from "react-icons/md";


import '../../styles/components/menu.sass'

type IParamsMenu = {
    title: string
}

const Menu = (params: IParamsMenu) => {
    const authContext = useContext(AuthContext);

    if (!authContext) {
        throw new Error('useAuth must be used within an AuthProvider');
    }


    const { userName, logout } = authContext;
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div id="hamburgerMenu">
            <button className="hamburger" onClick={toggleMenu}>
                <div className={`line ${isOpen ? "open" : ''}`}></div>
                <div className={`line ${isOpen ? "open" : ''}`}></div>
                <div className={`line ${isOpen ? "open" : ''}`}></div>
            </button>
            <h2 id="menuTitle">{params.title}</h2>
            <p className="logout" onClick={logout}><MdLogout /></p>
            <nav className={`nav ${isOpen ? "open" : ''}`}>
                <h3 id="userName">Olá {userName}</h3>
                <Link to={'/'} className="links"><FaHome /><p>home</p></Link>
                <Link to={'/mesas'} className="links"><FaHome /><p>mesas</p></Link>
            </nav>
        </div>
    );
}
export default Menu;
