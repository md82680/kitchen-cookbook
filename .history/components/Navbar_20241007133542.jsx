import Link from "next/link";
import SearchBar from "./SearchBar";
import styles from "../styles/Navbar.module.scss";

export default function Navbar({ recipes }) {
  return (
    <nav className={styles.navbar}>
      <ul>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="#about">About</Link>
        </li>
        <li>
          <Link href="#recipes">Recipes</Link>
        </li>
      </ul>
      <SearchBar recipes={recipes} />
    </nav>
  );
}
