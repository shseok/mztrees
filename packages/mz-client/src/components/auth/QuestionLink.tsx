import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { colors } from '~/lib/colors';

interface Props {
  question: string;
  name: string;
  to: string;
  className?: string;
}

const QuestionLink = ({ question, name, to, className }: Props) => {
  return (
    <Block className={className}>
      {question} <Link to={to}>{name}</Link>
    </Block>
  );
};

const Block = styled.div`
  color: ${colors.gray3};
  a {
    color: ${colors.gray5};
    font-weight: 600;
  }
`;

export default QuestionLink;
