import React, { useEffect } from "react";
import { searchUsers } from "../../firebase";
import { useState } from "react";
import "./searchbar.scss";
import { Link } from "react-router-dom";

const SearchBar = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleSearch = (e) => {
    if (e.target.value === "") {
      setSearchResults([]);
      return;
    }
    searchUsers(e.target.value).then((users) => {
      setSearchResults(users);
    });
  };
  useEffect(() => {}, [searchResults]);

  return (
    <div className="search">
      <input
        type="text"
        id="search-bar"
        placeholder="Search"
        onChange={handleSearch}
        onFocus={() => {
          setSearchOpen(true);
        }}
        onBlur={() => {
          setTimeout(() => {
            setSearchOpen(false);
          }, 200);
        }}
      />

      <div className="search-results padding">
        {searchOpen
          ? searchResults.map((user, index) => {
              return (
                <div className="search-result" key={index}>
                  <Link to={`/user/${user.uid}`}>
                    <img
                      src={user.photoURL}
                      alt="user"
                      className="user-image"
                    />
                  </Link>
                  <div className="user-info">
                    <Link to={`/user/${user.uid}`}>
                      <div className="user-name">{user.displayName}</div>
                    </Link>
                    <Link to={`/user/${user.uid}`}>
                      <div className="user-username">{user.username}</div>
                    </Link>
                  </div>
                </div>
              );
            })
          : null}
      </div>
    </div>
  );
};

export default SearchBar;
