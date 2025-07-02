import React, { useState } from "react";
import styled from "styled-components";
import logo from "../assets/logo.png";
import background from "../assets/login.jpg";
import { useNavigate } from "react-router-dom";
// import { createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
// import { firebaseAuth } from "../utils/firebase-config";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGetStarted = (e) => {
    e.preventDefault();
    if (email) setShowPassword(true);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/user/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Signup failed");
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setErrorMessage("");
      navigate("/");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <div className="bg-overlay" />
      <img src={logo} alt="Netflix" className="logo" />
      <div className="hero-content">
        <h1>Unlimited movies, TV shows, and more</h1>
        <h2>Starts at USD 2.99. Cancel anytime.</h2>
        <h3>Ready to watch? Enter your email to create or restart your membership.</h3>
        <form className="signup-form" onSubmit={showPassword ? handleSignup : handleGetStarted} autoComplete="on">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={showPassword}
          />
          {showPassword ? (
            <>
              <input
                type="password"
                placeholder="Password (min 6 chars)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoFocus
              />
              <button type="submit" disabled={loading}>
                {loading ? "Loading..." : "Sign Up"}
              </button>
            </>
          ) : (
            <button type="submit" disabled={loading}>
              {loading ? "Loading..." : "Get Started"}
            </button>
          )}
        </form>
        {errorMessage && <div className="error">{errorMessage}</div>}
      </div>
      <button className="sign-in-btn" onClick={() => navigate("/login")}>Sign In</button>
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
    background: rgba(0,0,0,0.65);
    z-index: 0;
  }
  .logo {
    width: 180px;
    position: absolute;
    top: 0;
    left: 0;
    margin: 32px 0 0 100px;
    z-index: 1;
  }
  .sign-in-btn {
    position: absolute;
    top: 32px;
    right: 100px;
    background: #e50914;
    color: #fff;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 700;
    padding: 10px 24px;
    cursor: pointer;
    z-index: 2;
    transition: background 0.2s;
    &:hover {
      background: #f6121d;
    }
  }
  .hero-content {
    z-index: 1;
    margin-top: 180px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    color: #fff;
    h1 {
      font-size: 3.2rem;
      font-weight: 900;
      margin-bottom: 18px;
      line-height: 1.1;
    }
    h2 {
      font-size: 1.5rem;
      font-weight: 400;
      margin-bottom: 24px;
    }
    h3 {
      font-size: 1.2rem;
      font-weight: 400;
      margin-bottom: 24px;
    }
    .signup-form {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-top: 0.5rem;
      input {
        background: rgba(0,0,0,0.45);
        border: 1px solid rgb(105, 105, 105);
        border-radius: 2px 0 0 2px;
        color: #fff;
        padding: 18px 16px;
        font-size: 1.1rem;
        width: 340px;
        max-width: 60vw;
        outline: none;
        height: 56px;
      }
      button {
        background: #e50914;
        color: #fff;
        border: none;
        border-radius: 0 2px 2px 0;
        font-size: 1.3rem;
        font-weight: 700;
        padding: 0 36px;
        height: 56px;
        cursor: pointer;
        transition: background 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
        &:hover {
          background: #f6121d;
        }
      }
    }
    .error {
      color: #e87c03;
      font-size: 1rem;
      margin-top: 18px;
    }
  }
  @media (max-width: 900px) {
    .logo {
      margin-left: 24px;
      width: 120px;
    }
    .sign-in-btn {
      right: 24px;
      top: 18px;
      padding: 8px 16px;
      font-size: 0.95rem;
    }
    .hero-content {
      margin-top: 120px;
      h1 {
        font-size: 2.1rem;
      }
      h2 {
        font-size: 1.1rem;
      }
      h3 {
        font-size: 1rem;
      }
      .signup-form input {
        width: 180px;
        font-size: 1rem;
      }
      .signup-form button {
        font-size: 1rem;
        padding: 12px 18px;
      }
    }
  }
`;

export default Signup;
