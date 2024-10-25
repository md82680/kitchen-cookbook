import LoginForm from "../components/LoginForm";
import styles from "../styles/LoginForm.module.scss";

export default function Login() {
  return (
    <div className={styles.container}>
      <h1>Login</h1>
      <LoginForm />
    </div>
  );
}
