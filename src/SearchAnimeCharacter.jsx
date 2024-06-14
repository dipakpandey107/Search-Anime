// src/SearchAnimeCharacter.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import './SearchAnimeCharacter.css';
import { FaHeart, FaArrowRight } from 'react-icons/fa';

const SearchAnimeCharacter = () => {
  const [query, setQuery] = useState('');
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalResults, setTotalResults] = useState(0);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  useEffect(() => {
    fetchCharacters();
  }, [page]);

  const fetchCharacters = async (searchQuery = '') => {
    setCharacters([])
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`https://api.jikan.moe/v4/characters`, {
        params: {
          page,
          limit: 15,
          q: searchQuery || query,
          order_by: 'favorites',
          sort: 'desc',
        },
      });
      if (response.data.data.length === 0) {
        setError('No results found for the given search query');
        setTotalResults(0);
      } else {
        setCharacters(response.data.data);
        setTotalResults(response.data.pagination.items.total);
        setHasNextPage(response.data.pagination.has_next_page);
      }
    } catch (error) {
      setError('An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1); // Reset to first page on new search
    fetchCharacters(query);
  };

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setPage((prevPage) => prevPage - 1);
  };

  return (
    <div className="container">
      <header className="header">
        <div className="header-background">
          <h1 className="title">Search Anime Character</h1>
        </div>
        <div className="search-bar">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter character name"
          />
          <button onClick={handleSearch}>Search</button>
        </div>
        {totalResults > 0 && (
          <p className="results-info">Total {totalResults} matching anime characters found</p>
        )}
      </header>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <div className="character-list">
        {characters.map((character) => (
          <div key={character.mal_id} className="character-card">
            <img src={character.images.jpg.image_url} alt={character.name} className="character-image" />
            <div className="character-info">
              <h2>{character.name}</h2>
              <div className="nicknames">
                {character.nicknames.length > 0 ? (
                  character.nicknames.map((nickname, index) => (
                    <span key={index} className="badge">{nickname}</span>
                  ))
                ) : (
                  <span className="badge">No Nickname</span>
                )}
              </div>
            </div>
            <div className="character-favorites">
              <FaHeart /> {character.favorites}
            </div>
            <a href={character.url} target="_blank" rel="noopener noreferrer" className="view-more">
              <FaArrowRight />
            </a>
          </div>
        ))}
      </div>
      <div className="pagination">
        {page > 1 && <button onClick={handlePrevPage}>Previous</button>}
        {hasNextPage && totalResults / page > 0 && <button onClick={handleNextPage}>Next</button>}
      </div>
    </div>
  );
};

export default SearchAnimeCharacter;
