import styled from 'styled-components';

export type CenterContentProps = {
  flexDirection?: 'row' | 'column'
}

export const CenterContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: ${(props: CenterContentProps) => props.flexDirection || 'row'};
`