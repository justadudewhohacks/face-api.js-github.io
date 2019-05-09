import styled from 'styled-components';

export type SideBySideProps = {
  alignItems?: string
}

export const SideBySide = styled.div`
  display: flex;
  flex-direction: row;
  align-items: ${(props: SideBySideProps) => props.alignItems || 'center'};
`