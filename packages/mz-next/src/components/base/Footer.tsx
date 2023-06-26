import FooterTabItem from "@/components/base/FooterTabItem";
import styles from "@/styles/Footer.module.scss";

const Footer = () => {
  return (
    <div className={styles.styled_footer}>
      <FooterTabItem icon={"home"} to="/" />
      <FooterTabItem icon={"search"} to="/search" />
      <FooterTabItem icon={"plus-circle"} to="/write" />
      <FooterTabItem icon={"bookmark"} to="/bookmarks" />
      <FooterTabItem icon={"setting"} to="/setting" />
    </div>
  );
};

export default Footer;
