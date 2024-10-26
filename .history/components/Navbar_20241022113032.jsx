import { useState } from "react";
import Link from "next/link";
import styles from "../styles/Navbar.module.scss"; // Assuming you use SCSS for styles
import LoginForm from "./LoginForm";

export default function Navbar() {
  const [showLoginForm, setShowLoginForm] = useState(false);

  const toggleLoginForm = () => {
    setShowLoginForm(!showLoginForm);
  };

  return (
    <nav className={styles.navbar}>
      <ul>
        <li>
          <Link href="/" scroll={false}>
            Home
          </Link>
        </li>
        <li>
          <Link href="#about" scroll={false}>
            About
          </Link>
        </li>
        <li>
          <Link href="#recipes" scroll={false}>
            Recipes
          </Link>
        </li>
        <li>
          <button onClick={toggleLoginForm}>
            {showLoginForm ? "Close" : "Login"}
          </button>
        </li>
      </ul>
      {showLoginForm && (
        <div className={styles.loginFormContainer}>
          <LoginForm />
        </div>
      )}
    </nav>
  );
}