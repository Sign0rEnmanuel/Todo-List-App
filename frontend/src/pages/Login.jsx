import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext.jsx";

import PixelBlast from "../animations/PixelBlast/PixelBlast";
import Shuffle from "../animations/Shuffle/Shuffle";
import TextType from "../animations/TextType/TextType";
import '../styles/Login.css';

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { loginUser, registerUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await loginUser(username, password);
            navigate("/dashboard");
        } catch (error) {
            console.error("Error logging in:", error);
            setError(error.message || "An error occurred");
            setPassword("")
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await registerUser(username, password);
            navigate("/dashboard");
        } catch (error) {
            console.error("Error registering:", error);
            setError(error.message || "An error occurred");
            setPassword("")
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    return (
        <div className="login-container">
            <div className="login-bck">
                <PixelBlast
                    color="#428446"
                    variant="square"
                    pixelSize={5}
                    patternScale={2.75}
                    patternDensity={1.5}
                    pixelSizeJitter={1.1}
                    speed={2}
                    edgeFade={0.13}
                    opacity={0.5}
                />
            </div>
            <div className="login-content">
                <div className="login-presentation">
                    <div className="h1">
                        <Shuffle text="Welcome to Todo List App" shuffleDirection="right" duration={1.5} shuffleTimes={1} stagger={0.2} loop={true} loopDelay={1.9} />
                    </div>
                    <div className="mini-description">
                        <TextType  text={["Manage your tasks", "Complete them and delete them", "Enjoy our service!"]} typingSpeed={75} pauseDuration={1500} showCursor cursorCharacter="_" deletingSpeed={50} variableSpeedEnabled={false} variableSpeedMin={60} variableSpeedMax={120} cursorBlinkDuration={0.5}/>
                    </div>
                </div>
                { error && <div className="login-error">{error}</div> }
                <div className="login-form">
                    <form onSubmit={handleSubmit} >
                        <div className="section-username">
                            <label htmlFor="username">Username</label>
                            <input type="text" id="username" name="username" value={username} onChange={handleChange} required />
                        </div>
                        <div className="section-password">
                            <label htmlFor="password">Password</label>
                            <input type="password" id="password" name="password" value={password} onChange={handlePasswordChange} required />
                        </div>
                        <div className="section-submit">
                            <button type="submit" disabled={loading}>
                                { loading ? 'Loading...' : 'Login' }
                            </button>
                            <button type="button" onClick={handleRegister} disabled={loading}>
                                { loading ? 'Loading...' : 'Register' }
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
};

export default Login;