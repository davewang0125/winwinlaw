'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'

export default function SearchBox() {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Searching for:', searchQuery)
    // TODO: Implement search functionality
  }

  return (
    <form className="search-form" onSubmit={handleSearch}>
      <div className="search-box">
        <Search className="search-icon" />
        <input
          type="text"
          placeholder="Search lawyers, legal issues..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </div>
    </form>
  )
}
