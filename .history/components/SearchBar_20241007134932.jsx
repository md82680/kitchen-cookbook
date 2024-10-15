import { useState } from "react";
import Link from "next/link";
import styles from "../styles/SearchBar.module.scss";

export default function SearchBar({ recipes }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // Handle search and filter recipes by title or description
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (term.length > 1) {
      const results = recipes.filter(
        (recipe) =>
          recipe.title.toLowerCase().includes(term) ||
          recipe.description.toLowerCase().includes(term)
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search recipes..."
        value={searchTerm}
        onChange={handleSearch}
        className={styles.searchInput}
      />

      {/* Display search results if search term is present */}
      {searchResults.length > 0 && (
        <ul className={styles.searchResults}>
          {searchResults.map((recipe, index) => (
            <li key={index}>
              <Link href={`/recipes/${recipe.slug}`}>
                <strong>{recipe.title}</strong> - {recipe.description}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
