import { useState } from "react";
import registerService from "../services/registerService";
import signupBg from "../assets/auth/signup-bg.png";
import logoMark from "../assets/ui/logo-mark.png";

function SignupPage({onBack}) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    async function handleSignup(e) {
        e.preventDefault();
        setErrorMessage(""); 
        setSuccessMessage(""); // Clear any previous success messages
        
        try {
            if(password !== confirmPassword) {
                setErrorMessage("Passwords do not match");
                return;
            }

            await registerService.register(username, email, password);
            
            // Set the UI success message instead of the alert
            setSuccessMessage("Account created successfully! Redirecting...");
            
            // Automatically switch back to login after 2 seconds
            setTimeout(() => {
                onBack();
            }, 2000);

        } catch(error) {
            console.error("Signup failed:", error);
            const detail = error.response?.data?.detail;
            
            if(Array.isArray(detail)) {
                setErrorMessage(detail[0].msg);
            } else {
                setErrorMessage(detail || "Signup failed");
            }
        }
    }

    return(
        <div className="auth-layout">
            <div className="auth-sidebar">
                
                <div className="brand-title" style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                    <img src={logoMark} alt="Logo" style={{ width: "40px", height: "40px" }} />
                    PROJECT<span style={{ color: "var(--accent)" }}>:</span>RIFT
                </div>

                <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <h2 style={{ fontSize: '24px', marginBottom: '30px' }}>Create Account</h2>

                    <div className="form-group">
                        <label className="form-label">Username</label>
                        <input
                            type="text"
                            className="minimal-input"
                            value={username}
                            onChange={e=> setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="minimal-input"
                            value={email}
                            onChange={e=> setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="minimal-input"
                            value={password}
                            onChange={e=> setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group" style={{ marginBottom: '10px' }}>
                        <label className="form-label">Confirm Password</label>
                        <input
                            type="password"
                            className="minimal-input"
                            value={confirmPassword}
                            onChange={e=> setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    {/* Error Message Display */}
                    {errorMessage && (
                        <div style={{ color: "var(--accent)", fontSize: "14px", marginBottom: "15px", fontWeight: "600" }}>
                            {errorMessage}
                        </div>
                    )}

                    {/* Success Message Display */}
                    {successMessage && (
                        <div style={{ color: "#00E676", fontSize: "14px", marginBottom: "15px", fontWeight: "600" }}>
                            {successMessage}
                        </div>
                    )}

                    <div style={{ flexGrow: 1 }}></div>

                    <button type="submit" className="primary-btn">
                        Register
                    </button>
                    
                    <button type="button" className="text-btn" onClick={onBack}>
                        Back to Login
                    </button>
                </form>

            </div>

            <div 
                className="auth-hero"
                style={{ backgroundImage: `url(${signupBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
                <div style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to right, #111111 0%, transparent 20%)"
                }}></div>
            </div>
        </div>
    );
}

export default SignupPage;