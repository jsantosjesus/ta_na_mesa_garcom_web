import { BrowserRouter } from "react-router-dom";
import Rotas from "./router";
import { useEffect } from "react";
import firebase from "firebase/compat/app";
import { firebaseConfig } from "./firebaseConfig";

const App = () => {

    useEffect(() => {
        if (!firebase.apps.length) {
          firebase.initializeApp(firebaseConfig);
        }
        console.log('useEffect do app');
      }, []);



    return (
        <div>
            <BrowserRouter>
                <Rotas />
            </BrowserRouter>
        </div>
    );
}
export default App;
