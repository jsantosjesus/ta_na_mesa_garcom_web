import { useState } from "react";
import Menu from "../menu";

const MenuBar = () => {

    const [menuOpen, setMenuOpen] = useState<boolean>(false);



 return (
<div>
    <button onClick={() => setMenuOpen(true)}>abrir menu</button>
    {menuOpen && <Menu />}
</div>
);
 }
 export default MenuBar;
