import { useState } from 'react';

export const useColumnSearch = () => {
  const [isDesc, setIsDesc] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [condition, setCondition] = useState("");
  const [isSearching, setIsSearching] = useState(false);
    
  const handleSearch = () => {
    setCondition(searchValue);
    setIsSearching(false);
  };

  const toggleSearch = () => setIsSearching(prev => !prev);
  const toggleSort = () => setIsDesc(prev => !prev);
  const handleSearchCancel = () => setIsSearching(false);
  const handleSearchChange = (value: string) => setSearchValue(value);

  return {
    isDesc,
    searchValue,
    condition,
    isSearching,
    handleSearch,
    toggleSearch,
    toggleSort,
    handleSearchCancel,
    handleSearchChange,
  };
};