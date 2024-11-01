import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/router';
import styles from "../styles/Navbar.module.scss";
import LoginForm from "./LoginForm";
import UserProfile from "./UserProfile";

export default function Navbar() {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  const toggleLoginForm = () => {
    setShowLoginForm(!showLoginForm);
  };

  const handleScroll = (e, id) => {
    e.preventDefault();
    
    // Only handle scroll on home page
    if (router.pathname === '/') {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    } else {
      // If not on home page, navigate to home page with hash
      router.push(`/#${id}`);
    }
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
          <a 
            href="/" 
            onClick={(e) => {
              e.preventDefault();
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
