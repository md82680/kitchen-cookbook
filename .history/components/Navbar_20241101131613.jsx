import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import styles from "../styles/Navbar.module.scss";
import LoginForm from "./LoginForm";
import UserProfile from "./UserProfile";

export default function Navbar() {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const { data: session, status } = useSession();

  const toggleLoginForm = () => {
    setShowLoginForm(!showLoginForm);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <nav className={`${styles.navbar} ${styles.sticky}`}>
      <ul>
        <li>
          <Link href="/#home">Home</Link>
        </li>
        <li>
          <Link href="/#about">About</Link>
        </li>
        <li>
          <Link href="/#recipes">Recipes</Link>
        </li>
        <li>
          {session ? (
            <UserProfile />
          ) : (
            <button onClick={toggleLoginForm}>Login</button>
          )}
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
