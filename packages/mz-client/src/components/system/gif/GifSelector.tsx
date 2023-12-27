import React, { useEffect, useState } from 'react';
import SearchForm from './SearchForm';
import GifList from './GifList';
import Modal from '../Modal';
import styles from '@/styles/gif/GifSelector.module.scss';
import Button from '../Button';
import { useWriteContext } from '@/context/WriteContext';
import { GIFObject } from '@/types/custom';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: () => void;
}

const key = process.env.NEXT_PUBLIC_GIPHY_API_KEY;

const GifSelector = ({ visible, onClose, onSelect }: Props) => {
  // Refcator: 4번 리렌더링 되는 문제 해결하기
  const [data, setData] = useState<GIFObject[]>([]);
  const [query, setQuery] = useState('website');
  const [isloading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState('');
  const {
    state: { form },
    actions,
  } = useWriteContext();

  const performSearch = (value: string) => setQuery(value);
  const selecteGif = (url: string) => {
    setSelected(url);
  };
  // fetching data from giphy api
  useEffect(() => {
    fetch(
      `https://api.giphy.com/v1/gifs/search?api_key=${key}&q=${query}&limit=25&offset=0&rating=g&lang=en`
    )
      .then((res) => res.json())
      .then((res) => setData(res.data))
      .catch((error) => console.error('Error fetching and parsing data', error))
      .finally(() => setIsLoading(false));
  }, [query]);

  return (
    <Modal visible={visible} fullWidth>
      <div className={styles.box}>
        <div className={styles.header}>
          <div className={styles.inner}>
            <h1 className={styles.title}>GIF 이미지 검색</h1>
            <SearchForm onSearch={performSearch} />
          </div>
        </div>
        <div className={styles.content_wrapper}>
          {isloading ? (
            <p>Loading...</p>
          ) : (
            <GifList data={data} selected={selected} handleClick={selecteGif} />
          )}
        </div>
        <section className={styles.footer}>
          <Button
            type='button'
            aria-label='gif 파일 선택'
            onClick={() => {
              actions.change('thumbnail', {
                extracted: [...form.thumbnail.extracted, selected],
                selected,
              });
              onClose();
              onSelect();
            }}
          >
            선택
          </Button>
          <Button
            type='button'
            aria-label='gif 파일 선택 취소'
            onClick={onClose}
            variant='secondary'
          >
            취소
          </Button>
        </section>
      </div>
    </Modal>
  );
};

export default GifSelector;
