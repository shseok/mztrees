import React, { useEffect, useState } from "react";
import SearchForm from "./SearchForm";
import GifList from "./GifList";
import Modal from "../Modal";
import styles from "@/styles/gif/GifSelector.module.scss";
import Button from "../Button";
import { useWriteContext } from "@/context/WriteContext";

interface Props {
  visible: boolean;
  onClose: () => void;
}

const key = process.env.NEXT_PUBLIC_GIPHY_API_KEY;

const GifSelector = ({ visible, onClose }: Props) => {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState("website");
  const [isloading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState("");
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
          {isloading ? (
            <p>Loading...</p>
          ) : (
            <GifList data={data} selected={selected} handleClick={selecteGif} />
          )}
        </div>
        <section className={styles.footer}>
          <Button
            onClick={() => {
              actions.change("thumbnail", {
                extracted: [...form.thumbnail.extracted, selected],
                selected,
              });
              onClose();
            }}
          >
            선택
          </Button>
          <Button onClick={onClose} variant="secondary">
            취소
          </Button>
        </section>
      </div>
    </Modal>
  );
};

export default GifSelector;
