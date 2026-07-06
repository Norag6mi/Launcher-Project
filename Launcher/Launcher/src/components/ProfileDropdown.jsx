import { useState } from "react";
import userService from "../services/userService";

function ProfileDropdown({ onLogout }) {
    const [open, setOpen] = useState(false);
    const user = userService.getUser();

    return (
        <div className="profile-container">
            <button className="profile-trigger" onClick={() => setOpen(!open)}>
                {user?.email || "Player"} <span style={{ fontSize: '10px' }}>▼</span>
            </button>

            {open && (
                <div className="profile-menu">
                    <button className="profile-menu-item">
                        Profile Details
                    </button>
                    <button className="profile-menu-item">
                        Settings
                    </button>
                    <button 
                        className="profile-menu-item danger" 
                        onClick={() => {
                            setOpen(false);
                            onLogout();
                        }}
                    >
                        Log Out
                    </button>
                </div>
            )}
        </div>
    );
}

export default ProfileDropdown;