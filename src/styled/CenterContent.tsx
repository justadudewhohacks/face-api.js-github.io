import styled from 'styled-components';

export type CenterContentProps = {
  alignItems?: string,
  flexDirection?: 'row' | 'column'
}

export const CenterContent = styled.div`
  display: flex;
  align-items: ${(props: CenterContentProps) => props.alignItems || 'center'};
  justify-content: center;
  flex-direction: ${(props: CenterContentProps) => props.flexDirection || 'row'};
  flex-wrap: wrap;
`