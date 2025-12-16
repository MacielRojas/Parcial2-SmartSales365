// src/components/SearchBar.tsx
import { useState } from "react";

type SearchBarProps = {
  onSearch: (term: string) => void;
};

function SearchBar({ onSearch }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm.trim());
  };

  return (
    <form className="d-flex flex-wrap gap-2" role="search" onChange={handleSubmit}>
      <input
        className="form-control flex-grow-1"
        type="search"
        placeholder="Buscar registro..."
        aria-label="Buscar"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {/* <button className="btn btn-outline-success" type="submit">
        Buscar
      </button> */}
    </form>
  );
}

export default SearchBar;
