import { useRef, useEffect } from 'react'
import { FaSearch, FaTimes } from 'react-icons/fa'
import '../styles/searchBar.css'

export default function SearchBar({ search, setSearch, suggestions = [], resources = [] }) {
  // support both prop names for backwards compatibility
  const items = suggestions.length > 0 ? suggestions : resources
  const inputRef = useRef(null)

  // Close suggestions on outside click
  useEffect(() => {
    const handler = (e) => {
      if (!inputRef.current?.closest('.searchbar-wrap')?.contains(e.target)) {
        // blur - suggestions hide via CSS :focus-within
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="searchbar-wrap" ref={inputRef}>
      <div className="search-input">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search by title or subject…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoComplete="off"
        />
        {search && (
          <button className="search-clear" onClick={() => setSearch('')}>
            <FaTimes />
          </button>
        )}
      </div>

      {search && items.length > 0 && (
        <div className="search-suggestions">
          {items.map((r, i) => (
            <div
              key={i}
              className="suggestion-item"
              onMouseDown={() => setSearch(r.title)}
            >
              <span className="suggestion-title">{r.title}</span>
              {r.subject && <span className="suggestion-sub">{r.subject}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}