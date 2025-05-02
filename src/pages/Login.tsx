import React, { useState, useEffect } from "react";
import { useUser } from "../hooks/useUser";
import "../styles/SignIn.css";

const SignIn: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loadingUser, error, loading } = useUser();

  const openForm = () => {
    const button = document.getElementById("mainButton");
    if (button) button.classList.add("active");
  };

  const closeForm = () => {
    const button = document.getElementById("mainButton");
    if (button) button.classList.remove("active");
  };

  const checkInput = (input: HTMLInputElement) => {
    if (input.value.length > 0) {
      input.classList.add("active");
    } else {
      input.classList.remove("active");
    }
  };

  useEffect(() => {
    localStorage.clear();
  }, []);

  const handleLogin = async () => {
    loadingUser(email, password);
  }

  return (
    <div id="signInContainer">
      <div id="mainButton">
        <div className="btn-text" onClick={openForm}>
          Iniciar sesión
        </div>

        <div className="modal">
          <div className="close-button" onClick={closeForm}>
            x
          </div>
          <div className="form-title">Inicio de sesión</div>

          {error && <p className="error">{error}</p>}

          <div className="input-group">
            <input
              type="text"
              id="name"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={(e) => checkInput(e.target)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
            <label htmlFor="name">Correo</label>
          </div>

          <div className="input-group">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={(e) => checkInput(e.target)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
            <label htmlFor="password">Contraseña</label>
          </div>

          <div className="form-button" onClick={handleLogin}>
            {loading ? "Cargando..." : "Iniciar sesión"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;