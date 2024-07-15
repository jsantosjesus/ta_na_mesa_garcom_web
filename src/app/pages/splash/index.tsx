import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/auth";
import { Navigate } from "react-router-dom";

import '../../styles/pages/splash.sass'
import { CircularProgress } from "@mui/material";

type IParamsLogin = {
    email: string,
    password: string
}

const Splash = () => {
    // const [loading, setLoading] = useState<boolean>(true);

    const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const {setNotAuthStorage, login, notAuthStorage} = authContext

    useEffect(() => {
        const userCredential = (localStorage.getItem('userCredential'));
        // console.log('rodeou');

        if (userCredential) {
            // console.log('userCredential')
            const userCredentialJson = JSON.parse(userCredential);

            const paramsLogin: IParamsLogin = {
                email: userCredentialJson.email!,
                password: userCredentialJson.password!
            }

            login(paramsLogin, false);
        } else {
            setNotAuthStorage(true);
            // console.log('notAuthStorage');
        }
        
    });
    
    return (
        <div id="bodySplash">
    <CircularProgress color="inherit" />
    {notAuthStorage && <Navigate to="/login" />}
    
</div>
);
 }
 export default Splash;
