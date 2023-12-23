import styles from '@/styles/MoreVertButton.module.scss';
import { MoreVert } from '@/components/vectors';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/utils/common';
interface MoreVertButtonProps {
  onClickMore: () => void;
}

interface Props
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    MoreVertButtonProps {}

const MoreVertButton = ({ onClickMore, ...rest }: Props) => {
  const { mode } = useTheme();
  return (
    <button
      className={cn(styles.styled_button, mode === 'dark' && styles.dark)}
      onClick={onClickMore}
      {...rest}
    >
      <MoreVert />
    </button>
  );
};

export default MoreVertButton;
