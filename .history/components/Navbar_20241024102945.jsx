import { useState } from "react";
import Link from "next/link";
import styles from "../styles/Navbar.module.scss";
import LoginForm from "./LoginForm";

export default function Navbar() {
  const [showLoginForm, setShowLoginForm] = useState(false);

  const toggleLoginForm = () => {
    setShowLoginForm(!showLoginForm);
  };

  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <nav className={`${styles.navbar} ${styles.sticky}`}>
      <ul>
        <li>
          <a href="/" onClick={scrollToTop}>Home</a>
        </li>
        <li>
          <Link href="#about" scroll={false}>About</Link>
        </li>
        <li>
          <Link href="#recipes" scroll={false}>Recipes</Link>
        </li>
        <li>
          <button onClick={toggleLoginForm}>
            {showLoginForm ? "Close" : "Login"}
          </button>
        </li>
      </ul>
      {showLoginForm && (
        <div className={styles.loginFormContainer}>
          <LoginForm onClose={() => setShowLoginForm(false)} />
        </div>
      )}
    </nav>
  );
}
