import React, { useState } from "react";
import styled from "styled-components";
import logo from "../assets/logo.png";
import background from "../assets/login.jpg";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../utils/constants";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setErrorMessage("");
      navigate("/");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <Container>
      <div className="bg-overlay" />
      <img src={logo} alt="Netflix" className="logo" />
      <div className="login-box">
        <h1>Sign In</h1>
        <form onSubmit={handleLogin} autoComplete="on">
          <input
            type="email"
            placeholder="Email or mobile number"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            required
            width="90%"
            margin-left="auto"
            margin-right="auto"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
            width="90%"
            margin-left="auto"
            margin-right="auto"
          />
          <button type="submit" className="sign-in-btn">Sign In</button>
          {errorMessage && <div className="error">{errorMessage}</div>}
        </form>
        <div className="separator">
          <span className="line"></span>
          <span className="or">OR</span>
          <span className="line"></span>
        </div>
        <button className="code-btn">Use a Sign-In Code</button>
        <div className="forgot-row">
          <a href="#" className="forgot">Forgot password?</a>
        </div>
        <div className="options">
          <label className="remember">
            <input type="checkbox" /> Remember me
          </label>
        </div>
        <div className="signup-now">
          New to Netflix? <span onClick={() => navigate("/signup")}>Sign up now.</span>
        </div>
        <div className="recaptcha">
          This page is protected by Google reCAPTCHA to ensure you're not a bot. <a href="https://www.google.com/recaptcha/about/" target="_blank" rel="noopener noreferrer">Learn more.</a>
        </div>
      </div>
    </Container>
  );
}

const Container = styled.div`
  min-height: 100vh;
  width: 100vw;
  position: relative;
  background: url(${background}) center center/cover no-repeat;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  .bg-overlay {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.7);
    z-index: 0;
  }
  .logo {
    width: 160px;
    // margin: 32px 0 0 0;
    z-index: 1;
    position: absolute;
    top: 0;
    left: 0;
    margin-left: 100px;
  }
  .login-box {
    position: relative;
    z-index: 1;
    background: rgba(0,0,0,0.50);
    border-radius: 4px;
    width: 100%;
    max-width: 480px;
    margin: 100px 0 0 0;
    padding: 56px 44px 48px 44px;
    display: flex;
    flex-direction: column;
    // box-shadow: 0 2px 8px rgba(0,0,0,0.5);
    color: #fff;
    h1 {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 28px;
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      input {
        background: rgba(0,0,0,0.45);
        border: 1px solid rgb(105, 105, 105);
        border-radius: 4px;
        color: #fff;
        padding: 16px;
        font-size: 1rem;
        margin-bottom: 4px;
        transition: border 0.2s;
        &:focus {
          outline: none;
          border: 1.5px solid #e50914;
        }
        width: 90%;
        margin-left: auto;
        margin-right: auto;
      }
      .sign-in-btn {
        background: #e50914;
        color: #fff;
        border: none;
        border-radius: 4px;
        font-size: 1.1rem;
        font-weight: 700;
        padding: 14px 0;
        margin-top: 8px;
        cursor: pointer;
        transition: background 0.2s;
        width: 90%;
        margin-left: auto;
        margin-right: auto;
        &:hover {
          background: #f6121d;
        }
      }
    }
    .separator {
      display: flex;
      align-items: center;
      margin: 12px 0 8px 0;
      .line {
        flex: 1;
        height: 1px;
        background: #333;
      }
      .or {
        color: #b3b3b3;
        font-size: 0.95rem;
        margin: 0 12px;
        font-weight: 500;
      }
    }
    .code-btn {
      width: 90%;
      background: #333;
      color: #fff;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      font-weight: 500;
      padding: 12px 0;
      margin-bottom: 8px;
      cursor: pointer;
      transition: background 0.2s;
      margin-left: auto;
      margin-right: auto;
      &:hover {
        background: #444;
      }
    }
    .forgot-row {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 8px;
      .forgot {
        color: #b3b3b3;
        font-size: 0.95rem;
        text-decoration: underline;
        cursor: pointer;
        &:hover {
          color: #fff;
        }
      }
    }
    .options {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      .remember {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 0.95rem;
        color: #b3b3b3;
        input[type="checkbox"] {
          accent-color: #737373;
        }
      }
    }
    .signup-now {
      margin: 18px 0 0 0;
      color: #b3b3b3;
      font-size: 1rem;
      span {
        color: #fff;
        font-weight: 500;
        cursor: pointer;
        &:hover {
          text-decoration: underline;
        }
      }
    }
    .recaptcha {
      margin: 18px 0 0 0;
      color: #8c8c8c;
      font-size: 0.85rem;
      a {
        color: #0071eb;
        text-decoration: none;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
  @media (max-width: 600px) {
    .login-box {
      padding: 32px 4vw 32px 4vw;
      max-width: 98vw;
    }
    .logo {
      width: 120px;
      margin-top: 18px;
      margin-left: 12px;
    }
  }
`;

export default Login;
