import FooterTabItem from '@/components/base/FooterTabItem';
import styles from '@/styles/Footer.module.scss';

const Footer = () => {
  return (
    <footer className={styles.styled_footer}>
      <FooterTabItem icon={'home'} to='/' />
      <FooterTabItem icon={'search'} to='/search' />
      <FooterTabItem icon={'plus-circle'} to='/write' />
      <FooterTabItem icon={'bookmark'} to='/bookmark' />
      <FooterTabItem icon={'setting'} to='/setting' />
    </footer>
  );
};

export default Footer;
