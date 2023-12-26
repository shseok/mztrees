import Image from 'next/image';
import Modal from './Modal';
import styles from '@/styles/ImageViewer.module.scss';
import Button from './Button';

interface Props {
  visible: boolean;
  url?: string;
  onClose: () => void;
  onConfirm: () => void;
}

const ImageViewer = ({ visible, url, onClose, onConfirm }: Props) => {
  return (
    <Modal visible={visible} fullWidth>
      <div className={styles.image}>
        <Image
          src={url ?? 'https://img.mztrees.com/not-fount-image.svg'}
          alt='이미지 뷰어'
          title='해당 이미지는 원본 크기로 표시됩니다'
          fill
          priority
          sizes='1000px'
        />
      </div>
      <p className={styles.notification}>
        위 이미지는 원본 크기이며, 작은 이미지 선택시 화질이 깨질 수 있습니다.
      </p>
      <section className={styles.footer}>
        <Button onClick={onConfirm} aria-label='Select image'>
          선택
        </Button>
        <Button
          onClick={onClose}
          variant='secondary'
          aria-label='Cancel selected image'
        >
          취소
        </Button>
      </section>
    </Modal>
  );
};

export default ImageViewer;
