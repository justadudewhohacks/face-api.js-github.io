import { Dialog, DialogContent, DialogTitle, LinearProgress } from '@material-ui/core';
import * as React from 'react';

export interface ModalLoaderProps {
  title: string
}

export const ModalLoader = (props: ModalLoaderProps) =>         
  <Dialog
    disableBackdropClick
    disableEscapeKeyDown
    open={true}
  >
    <DialogTitle>
      { props.title }
    </DialogTitle>
    <DialogContent>
      <LinearProgress />
    </DialogContent>
  </Dialog>