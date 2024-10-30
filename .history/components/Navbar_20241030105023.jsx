import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import styles from "../styles/Navbar.module.scss";
import LoginForm from "./LoginForm";

export default function Navbar() {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const { data: session, status } = useSession();

  console.log('Navbar session:', session);
  console.log('Auth status:', status);

  const toggleLoginForm = () => {
    setShowLoginForm(!showLoginForm);
  };

  const handleAuthClick = async () => {
    if (session) {
      await signOut({
        redirect: false,
        callbackUrl: '/'
      });
    } else {
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
            {status === 'loading' ? '...' : session ? 'Logout' : 'Login'}
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
