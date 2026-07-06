import ProfileDropdown from "./ProfileDropdown";

function Navbar({ onLogout }) {
    return (
        <div className="top-nav">
            <ProfileDropdown onLogout={onLogout} />
        </div>
    );
}

export default Navbar;