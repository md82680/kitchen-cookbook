import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react"; // Add this import
import styles from "../styles/Navbar.module.scss";
import LoginForm from "./LoginForm";

export default function Navbar() {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const { data: session } = useSession(); // Add this hook

  const toggleLoginForm = () => {
    setShowLoginForm(!showLoginForm);
  };

  const handleAuthClick = async () => {
    if (session) {
      // Handle logout
      await signOut({ redirect: false });
      // You might want to handle post-logout actions here
    } else {
      // Handle login
      toggleLoginForm();
    }
  };

  return (
    <nav className={`${styles.navbar} ${styles.sticky}`}>
      <ul>
        <li>
          <a
            href="/"
            onClick={() => {
              scrollToTop();
            }}
          >
            Home
          </a>
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
          <button onClick={handleAuthClick}>
            {session ? "Logout" : "Login"}
          </button>
        </li>
      </ul>
      {showLoginForm && !session && (
        <div className={styles.loginFormContainer}>
          <LoginForm onClose={() => setShowLoginForm(false)} />
        </div>
      )}
    </nav>
  );
}
