import { useContext } from "react";
import { AuthContext } from "../../context/auth";
import { Link } from "react-router-dom";

const Menu = () => {
    const authContext = useContext(AuthContext);

    if (!authContext) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

const {userName} = authContext;

 return (
<div>
    {userName}
    <p><Link to={'/mesas'}>mesas</Link></p>
    <p><Link to={'/'}>home</Link></p>
</div>
);
 }
 export default Menu;
