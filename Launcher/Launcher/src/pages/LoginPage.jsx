import LoginForm from "../components/LoginForm";
import loginBg from "../assets/auth/login-bg.png"; 
import logoMark from "../assets/ui/logo-mark.png";

function LoginPage({ onLogin, onSignup }) {
    return (
        <div className="auth-layout">
            
            {/* The fixed 400px Left Sidebar */}
            <div className="auth-sidebar">
                
                <div className="brand-title" style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                    <img src={logoMark} alt="Logo" style={{ width: "40px", height: "40px" }} />
                    PROJECT<span style={{ color: "var(--accent)" }}>:</span>RIFT
                </div>
                
                <LoginForm 
                    onLogin={onLogin}
                    onSignup={onSignup}
                />
            </div>
            
            {/* The edge-to-edge cinematic background */}
            <div 
                className="auth-hero"
                style={{ 
                    backgroundImage: `url(${loginBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                {/* The gradient fade overlay */}
                <div style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to right, #111111 0%, transparent 20%)"
                }}></div>
            </div>

        </div>
    );
}

export default LoginPage;