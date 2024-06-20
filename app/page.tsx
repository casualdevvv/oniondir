'use client';
import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<{ link: string; title: string; }[]>([]);
  const [searchTime, setSearchTime] = useState<number>(0);

  const handleSearchChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setSearchQuery(e.target.value);
  };

  const fetchResults = async () => {
    setIsLoading(true);
    const startTime = performance.now();
    try {
      const response = await fetch(`https://oniondirectory.netlify.app/api/onionquery`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          search: searchQuery,
        }),
      });
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Failed to fetch search results:", error);
      setResults([]);
    }
    const endTime = performance.now();
    setSearchTime(Number(((endTime - startTime) / 1000).toFixed(2)));
    setIsLoading(false);
  };

  const handleSearch = () => {
    if (searchQuery.trim() !== '') {
      fetchResults();
    }
  };

  const handleKeyDown = (e: { key: string; }) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#252525] p-4 md:p-24">
    <header className="mb-5 md:mb-10">
      <h1 className="text-3xl md:text-5xl font-bold text-white">Tr4x&apos;s Onion Directory</h1>
    </header>
    <div className="flex justify-center w-full">
      <div className="flex items-center w-full md:w-1/2 bg-[#2D2D2D] rounded-lg">
        <FiSearch className="ml-4 text-white" />
        <input
          type="text"
          placeholder="What are you looking for?"
          className="w-full p-2 md:p-4 rounded-l-lg focus:outline-none bg-[#2D2D2D] text-white placeholder-gray-500"
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
        />
      </div>
      <button
        className="bg-blue-500 text-white font-bold p-2 md:p-4 rounded-r-lg hover:bg-blue-600"
        style={{ userSelect: 'none' }}
        onClick={handleSearch}
      >
        Go
      </button>
      </div>
      {isLoading ? (
      <div className="mt-5 flex justify-center items-center">
  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
</div>
      ) : Array.isArray(results) && results.length > 0 ? (
        <div className="mt-5 w-full md:w-1/2">
          <p className="text-gray-400 text-sm">Search completed in {searchTime} seconds</p>
          {Array.isArray(results) && results.length > 0 ? (
            <div className="mt-2">
              {results.map((result, index) => (
                <div 
                  key={index} 
                  className="mb-4 p-4 bg-[#333333] rounded-lg overflow-hidden"
                  style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
                >
                  <a href={result.link} className="text-blue-400 text-xl font-bold block hover:underline">
                    {result.title}
                  </a>
                  <a href={result.link} className="text-gray-400 text-sm block hover:underline">
                    {result.link}
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-white">No results found</div>
          )}
        </div>
      ) : (
        null // Do not render anything if results are null initially
      )}
      <footer className="mt-10 w-full text-center text-sm text-gray-400">
  <p>Disclaimer: We disclaim any responsibility for the content found on external sites linked.</p>
  <p>Original Website: https://touched-easily-louse.ngrok-free.app/</p>
</footer>
    </main>
  );
}
