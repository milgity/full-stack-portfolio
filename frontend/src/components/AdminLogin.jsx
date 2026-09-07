import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";
function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        try {
            const response = await fetch(
                "http://localhost:5000/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Login failed");
                return;
            }

            // Save JWT
            localStorage.setItem("adminToken", data.token);

            // Go to dashboard
            navigate("/admin/dashboard");

        } catch (error) {
            console.error(error);
            setError("Unable to connect to the server.");
        }
    };

    return (
        <div className="admin-login">
            <h2>Admin Login</h2>

            <form onSubmit={handleSubmit}>

                <input
                    type="email"
                    placeholder="Admin Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type="submit">
                    Login
                </button>

            </form>

            {error && (
                <p className="error">
                    {error}
                </p>
            )}
        </div>
    );
}

export default AdminLogin;