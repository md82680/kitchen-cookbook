import { useState } from "react";
import { signIn } from "next-auth/react";
import styles from "../styles/Login.module.scss";

export default function LoginForm({ onClose }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (result.error) {
        setError("Invalid credentials");
      } else {
        onClose();
        window.location.reload();
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred");
    }
  };

  return (
    <div className={styles.loginFormWrapper}>
      <button className={styles.closeButton} onClick={onClose}>
        ×
      </button>
      <h2 style={{ 
        textAlign: 'center', 
        marginBottom: '1.5rem',
        fontFamily: 'var(--font-primary)',
        color: 'var(--color-text)'
      }}>
        Welcome Back
      </h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <div className={styles.error}>{error}</div>}
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
          autoComplete="username"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          autoComplete="current-password"
        />
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}
