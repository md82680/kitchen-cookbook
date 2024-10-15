import { useState } from 'react';
import Link from 'next/link';
import styles from '../styles/SearchBar.module.scss';

export default function SearchBar({ recipes }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);

  // Fuzzy search function to filter recipes by title or description
  const handleSearch = (e) => {
    const keyword = e.target.value.toLowerCase();
    setSearchTerm(keyword);

    if (keyword.length > 1) {
      const filteredResults = recipes.filter((recipe) =>
        recipe.title.toLowerCase().includes(keyword) ||
        recipe.description.toLowerCase().includes(keyword)
      );
      setResults(filteredResults);
    } else {
      setResults([]);
    }
  };

  return (
    <div className={styles.searchBar}>
      <input
        type="text"
        placeholder="Search recipes..."
        value={searchTerm}
        onChange={handleSearch}
      />
      {results.length > 0 && (
        <ul className={styles.results}>
          {results.map((recipe, index) => (
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
