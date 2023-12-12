import {Routes, Route} from "react-router-dom";
import SignIn from "./components/sign-in/SignIn";
import SignUp from "./components/sign-up/SignUp";
import AboutMe from "./components/about/AboutMe";
import Admin from "./components/admin/Admin";

import "./App.css"

function App() {
    return (
        <Routes>
            <Route path="/sign-up" element={<SignUp/>}/>
            <Route path="/sign-in" element={<SignIn/>}/>
            <Route path="/me" element={<AboutMe/>}/>
            <Route path="/admin" element={<Admin/>}/>
            <Route path="*" element={<AboutMe/>}/>
        </Routes>
    );
}

export default App;