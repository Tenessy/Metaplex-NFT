'use client';

import dynamic from 'next/dynamic';
import ThemeSwitcher from './themeSwitcher';
import MetaplexLogo from '@/assets/logos/metaplex-logo.png';

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
    <div className='z-10 w-full max-w-4xl items-center justify-between font-mono text-sm lg:flex'>
      <div className='relative z-[-1] flex place-items-center '>
        <img
          className='relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert'
          src={MetaplexLogo.src}
          alt='<Metaplex Logo'
          width={300}
        />
      </div>
      <div className='flex pt-4 lg:pt-0 w-full items-end justify-center gap-4 dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none'>
        <DynamicWalletButton />
        {/* <ThemeSwitcher /> */}
      </div>
    </div>
  );
};

export default Header;
