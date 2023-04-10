import React from 'react';
import styled from "styled-components";
import {colors} from "~/lib/colors";
import {Logo} from "~/components/vectors";

const Header = () => {
    return (
        <Block><Logo/></Block>
    );
};

const Block = styled.header`
    height: 56px;
  border-bottom: 1px solid ${colors.gray0};
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg{
    width: 87px;
    height: 17px;
  }
`

export default Header;