'use client';

import React from 'react';
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from '@material-tailwind/react';
import { SolanaLogo } from './solana';

interface DialogDefaultProps {
  handleClose: () => void;
  open: boolean;
  showFooter?: boolean;
  children: React.ReactNode;
  imageUri: string;
}

export function DialogMaterial({
  open,
  showFooter,
  children,
  imageUri,
  handleClose,
}: DialogDefaultProps) {
  // window.open('http://www.example.com?ReportID=1', '_blank');
  return (
    <Dialog
      open={open}
      handler={handleClose}
      size='sm'
      animate={{
        mount: { scale: 1, y: 0 },
        unmount: { scale: 0.9, y: -100 },
      }}
    >
      <DialogHeader>
        <img
          className='h-96 w-full rounded-lg object-cover object-center shadow-xl shadow-blue-gray-900/50'
          src={imageUri}
          alt='nature image'
        />
      </DialogHeader>
      <DialogBody>{children}</DialogBody>
      {
        /* Optional footer */
        showFooter && (
          <DialogFooter>
            <Button
              className='flex items-center justify-center gap-2'
              variant='gradient'
              color='black'
              onClick={handleClose}
            >
              <SolanaLogo />
              Découvrir
            </Button>
          </DialogFooter>
        )
      }
    </Dialog>
  );
}
