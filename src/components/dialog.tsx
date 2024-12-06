'use client';

import React from 'react';
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from '@material-tailwind/react';

interface DialogDefaultProps {
  handleClose: () => void;
  open: boolean;
  showFooter?: boolean;
  children: React.ReactNode;
}

export function DialogMaterial({
  open,
  showFooter,
  children,
  handleClose,
}: DialogDefaultProps) {
  return (
    <Dialog
      open={open}
      handler={handleClose}
      animate={{
        mount: { scale: 1, y: 0 },
        unmount: { scale: 0.9, y: -100 },
      }}
    >
      <DialogHeader>Its a simple dialog.</DialogHeader>
      <DialogBody>{children}</DialogBody>
      {
        /* Optional footer */
        showFooter && (
          <DialogFooter>
            <Button
              variant='text'
              color='red'
              onClick={handleClose}
              className='mr-1'
            >
              <span>Cancel</span>
            </Button>
            <Button variant='gradient' color='green' onClick={handleClose}>
              <span>Confirm</span>
            </Button>
          </DialogFooter>
        )
      }
    </Dialog>
  );
}
