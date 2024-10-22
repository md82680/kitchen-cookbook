import Link from "next/link";
import styles from "../styles/Navbar.module.scss";
import LoginForm from "./LoginForm";
import { useState } from "react";
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
          <Link href="/" scroll={false}>
            About
          </Link>
        </li>
        <li>
          <Link href="/" scroll={false}>
            Recipes
          </Link>
        </li>
        <li>
          <button onClick={toggleLoginForm}>
            {showLoginForm ? "Close" : "Login"}
          </button>
        </li>
      </ul>
    </nav>
  );
}
