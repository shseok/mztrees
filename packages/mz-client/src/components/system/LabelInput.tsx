import React, { forwardRef, useState } from 'react';
import styled, { css } from 'styled-components';
import Input, { type Props as InputProps } from '~/components/system/Input';
import { colors } from '~/lib/colors';

interface Props extends InputProps {
  label: string;
}

const LabelInput = forwardRef<HTMLInputElement, Props>(({ label, ...rest }: Props, ref) => {
  const [focused, setFocused] = useState(false);

  const onFocus = () => {
    setFocused(true);
  };

  const onBlur = () => {
    setFocused(false);
  };

  return (
    <Block>
      <Label focused={focused}>{label}</Label>
      <Input onFocus={onFocus} onBlur={onBlur} {...rest} ref={ref} />
    </Block>
  );
});
const Block = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label<{ focused?: boolean }>`
  font-size: 16px;
  color: ${colors.gray4};
  font-weight: 600;
  line-height: 1.5;
  margin-bottom: 8px;

  ${(props: { focused?: boolean }) =>
    props.focused &&
    css`
      color: ${colors.primary};
    `}
`;

export default LabelInput;
