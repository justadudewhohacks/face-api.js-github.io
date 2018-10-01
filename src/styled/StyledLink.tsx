import Link from 'gatsby-link';
import styled, { css } from 'styled-components';

const linkCss = css`
  padding: 4px;
  color: inherit;
  text-decoration: none;
  display: block;
`

export const StyledLink = styled(Link)`
  ${linkCss}
`

export const StyledAbsLink = styled.a`
  ${linkCss}
`