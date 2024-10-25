import LoginForm from "../components/LoginForm";
import styles from "../styles/Login.module.css";

export default function Login() {
  return (
    <div className={styles.container}>
      <h1>Login</h1>
      <LoginForm />
    </div>
  );
}
