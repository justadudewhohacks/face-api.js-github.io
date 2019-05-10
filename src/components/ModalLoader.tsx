import * as Mui from '@material-ui/core';
import * as React from 'react';

export interface ModalLoaderProps {
  title: string
}

export const ModalLoader = (props: ModalLoaderProps) =>
  <Mui.Dialog
    disableBackdropClick
    disableEscapeKeyDown
    open={true}
  >
    <Mui.DialogTitle>
      { props.title }
    </Mui.DialogTitle>
    <Mui.DialogContent>
      <Mui.LinearProgress />
    </Mui.DialogContent>
  </Mui.Dialog>