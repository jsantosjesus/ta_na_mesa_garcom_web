import { BrowserRouter } from "react-router-dom";
import Rotas from "./router";

const App = () => {

    return (
        <div>
            <BrowserRouter>
                <Rotas />
            </BrowserRouter>
        </div>
    );
}
export default App;
