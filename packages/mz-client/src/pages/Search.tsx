import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Header from '~/components/base/Header';
import TabLayout from '~/components/layout/TapLayout';
import SearchInput from '~/components/search/SearchInput';
// import useDebounce from '~/hooks/useDebounce';
import { useDebounce } from 'use-debounce';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { stringify } from 'qs';
import { searchItems } from '~/lib/api/search';
import SearchResultCardList from '~/components/search/SearchResultCardList';
import { SearchItemsResult } from '~/lib/api/types';

const Search = () => {
  const [searchParams] = useSearchParams();
  const [searchText, setSearchText] = useState(searchParams.get('q') ?? '');
  // const inputResult = useDebounce({ value: searchText, delay: 300 });
  const [inputResult] = useDebounce(searchText, 300);
  const [data, setData] = useState<SearchItemsResult | null>(null);
  const navigate = useNavigate();

  const fetchData = async () => {
    if (!inputResult.trim()) return;
    const rs = await searchItems({ q: inputResult });
    setData(rs);
  };
  useEffect(() => {
    console.log('in');
    fetchData();
    navigate(`/search?${stringify({ q: inputResult })}`);
  }, [inputResult, navigate]);

  console.log('render');

  return (
    <TabLayout
      header={
        <StyledHeader title={<SearchInput value={searchText} onChangeText={setSearchText} />} />
      }
    >
      {inputResult}
      {data && <SearchResultCardList items={data.list} />}
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
