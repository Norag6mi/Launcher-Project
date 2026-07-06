import { useState } from "react";

import LoginPage from "./pages/LoginPage";
import GamePage from "./pages/GamePage";
import SignupPage from "./pages/SignupPage";

import tokenService from "./services/tokenService";


function App() {

    const [isLoggedIn, setIsLoggedIn] = useState(!!tokenService.getToken());
    const [showSignup, setShowSignup] = useState(false);
    const handleLogout = () => 
    {
        tokenService.removeToken();
        setIsLoggedIn(false);

    };


    return (

        <div>

            {
                isLoggedIn
                ?
                <GamePage 
                    onLogout={handleLogout}
                />
                :
                showSignup
                ?
                <SignupPage
                    onBack={() => setShowSignup(false)}
                />

                :
                <LoginPage
                    onLogin={() => setIsLoggedIn(true)}
                    onSignup={() => setShowSignup(true)}
                />
            }

        </div>

    );

}

export default App;
