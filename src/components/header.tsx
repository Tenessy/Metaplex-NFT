'use client';

import dynamic from 'next/dynamic';
import ThemeSwitcher from './themeSwitcher';
import createNft from '@/lib/umi/createNft';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';
import { mplCore } from '@metaplex-foundation/mpl-core';
import UploadForm from './uploadForm';

// Fixes: Hydration failed because the initial UI does not match what was rendered on the server.
const DynamicWalletButton = dynamic(
  async () =>
    (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  {
    ssr: false,
  }
);

const Header = () => {
  return (
    <div className='z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex'>
      <p className='flex w-full justify-center border-b border-gray-300  pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30'>
        Get started by editing&nbsp;
        <code className='font-mono font-bold'>src/app/page.tsx</code>
      </p>
      <div className='flex pt-4 lg:pt-0 w-full items-end justify-center gap-4 dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none'>
        <DynamicWalletButton />
        <ThemeSwitcher />
      </div>
      <UploadForm />
    </div>
  );
};

export default Header;
