import React, { useEffect, useState } from "react";
import SearchForm from "./SearchForm";
import GifList from "./GifList";
import Modal from "../Modal";
import styles from "@/styles/gif/GifSelector.module.scss";
import Button from "../Button";

interface Props {
  visible: boolean;
  onClose: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const key = process.env.NEXT_PUBLIC_GIPHY_API_KEY;

const GifSelector = ({ visible, onClose }: Props) => {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState("webdeveloper");
  const [isloading, setIsLoading] = useState(true);

  const performSearch = (value: string) => setQuery(value);

  // fetching data from giphy api
  useEffect(() => {
    fetch(
      `https://api.giphy.com/v1/gifs/search?api_key=${key}&q=${query}&limit=25&offset=0&rating=g&lang=en`
    )
      .then((res) => res.json())
      .then((res) => setData(res.data))
      .catch((error) => console.log("Error fetching and parsing data", error))
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
          {isloading ? <p>Loading...</p> : <GifList data={data} />}
        </div>
        <section className={styles.footer}>
          <Button onClick={() => {}}>선택</Button>
          <Button onClick={onClose} variant="secondary">
            취소
          </Button>
        </section>
      </div>
    </Modal>
  );
};

export default GifSelector;
