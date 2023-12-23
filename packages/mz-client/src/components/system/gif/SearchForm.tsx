import SearchInput from '@/components/search/SearchInput';
import styles from '@/styles/gif/SearchForm.module.scss';
import React, { useState } from 'react';
import Button from '../Button';

interface Props {
  onSearch: (value: string) => void;
}

function SearchForm({ onSearch }: Props) {
  const [searchText, setSearchText] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(searchText);
    e.currentTarget.reset();
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <SearchInput value={searchText} onChangeText={setSearchText} />
      <Button type='submit' id='submit' size='small'>
        검색
      </Button>
    </form>
  );
}

export default SearchForm;
