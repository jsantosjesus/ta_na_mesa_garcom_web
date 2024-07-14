import { useContext } from "react";
import { AuthContext } from "../../context/auth";

const Menu = () => {
    const authContext = useContext(AuthContext);

    if (!authContext) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

const {userName} = authContext;

 return (
<div>
    {userName}
</div>
);
 }
 export default Menu;
