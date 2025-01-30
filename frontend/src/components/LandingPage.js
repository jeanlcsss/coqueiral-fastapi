import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Bem-vindo ao Coqueiral!</h1>
      <div style={styles.buttonGroup}>
        <button 
          onClick={() => navigate("/login")} 
          style={styles.button}
        >
          Fazer Login
        </button>
        <button 
          onClick={() => navigate("/registrar")} 
          style={styles.button}
        >
          Criar Conta
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    textAlign: "center",
    padding: "20px",
    backgroundColor: "#f0f2f5",
  },
  title: {
    fontSize: "2.5rem",
    color: "#1a1a1a",
    marginBottom: "2rem",
  },
  buttonGroup: {
    display: "flex",
    gap: "1rem",
  },
  button: {
    padding: "12px 24px",
    fontSize: "1rem",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
};

export default LandingPage;