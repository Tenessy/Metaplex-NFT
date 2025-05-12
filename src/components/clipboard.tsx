import React from 'react';
import { Typography, Button } from '@material-tailwind/react';
import { useCopyToClipboard } from 'usehooks-ts';
import { CheckIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';

interface ClipboardProps {
  textButton: string;
}

export function Clipboard({ textButton }: ClipboardProps) {
  const [value, copy] = useCopyToClipboard();
  const [copied, setCopied] = React.useState(false);

  return (
    <Button
      onMouseLeave={() => setCopied(false)}
      onClick={() => {
        copy(textButton);
        setCopied(true);
        console.log(value);
      }}
      className='flex items-center gap-x-3 px-4 py-2.5 lowercase'
    >
      <Typography
        className='border-r border-gray-400/50 pr-3 font-normal'
        variant='small'
      >
        {textButton}
      </Typography>
      {copied ? (
        <CheckIcon className='h-4 w-4 text-white' />
      ) : (
        <DocumentDuplicateIcon className='h-4 w-4 text-white' />
      )}
    </Button>
  );
}
