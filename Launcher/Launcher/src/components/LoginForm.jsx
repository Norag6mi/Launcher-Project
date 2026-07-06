import { useState } from "react";
import authService from "../services/authService";
import tokenService from "../services/tokenService";

function LoginForm({ onLogin , onSignup }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        setErrorMessage(""); // Refresh previous errors

        try {
            const response = await authService.login(email, password);
            tokenService.saveToken(response.access_token);
            onLogin();
        } catch(error) {
            console.error("Login failed:", error.response?.data);
            const detail = error.response?.data?.detail;
            setErrorMessage(detail || "Invalid email or password");
        }
    }

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
            
            <div style={{ flexGrow: 1 }}>
                <h2 style={{ fontSize: '24px', marginBottom: '30px' }}>Sign In</h2>

                <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        className="minimal-input"
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Password</label>
                    <input
                        type="password"
                        className="minimal-input"
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                    />
                </div>

                {/* UI Error Message Display */}
                {errorMessage && (
                    <div style={{ color: "var(--accent)", fontSize: "14px", marginTop: "15px", fontWeight: "600" }}>
                        {errorMessage}
                    </div>
                )}
            </div>

            <button type="submit" className="primary-btn">
                Log In
            </button>

            <button
                type="button"
                className="text-btn"
                onClick={onSignup}
            >
                Create Account
            </button>
        </form>
    );
}

export default LoginForm;