import React, { useState } from 'react';
import styled from 'styled-components';
import Header from '~/components/base/Header';
import TabLayout from '~/components/layout/TapLayout';
import SearchInput from '~/components/search/SearchInput';
// import useDebounce from '~/hooks/useDebounce';
import { useDebounce } from 'use-debounce';

const Search = () => {
  const [searchText, setSearchText] = useState('');
  // const inputResult = useDebounce({ value: searchText, delay: 300 });
  const [inputResult] = useDebounce(searchText, 300);
  console.log('search render');
  return (
    <TabLayout
      header={
        <StyledHeader title={<SearchInput value={searchText} onChangeText={setSearchText} />} />
      }
    >
      {inputResult}
    </TabLayout>
  );
};

const StyledHeader = styled(Header)`
  & > .title {
    width: 100%;

    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

export default Search;
