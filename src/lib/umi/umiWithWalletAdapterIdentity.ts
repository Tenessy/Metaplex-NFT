import useUmiStore from '@/store/useUmiStore';
import { mplCore } from '@metaplex-foundation/mpl-core';
import { Umi } from '@metaplex-foundation/umi';
import {
  WalletAdapter,
  walletAdapterIdentity,
} from '@metaplex-foundation/umi-signer-wallet-adapters';
import { useWallet } from '@solana/wallet-adapter-react';

export const umiWithWalletAdapterIdentity = (wallet: WalletAdapter): Umi => {
  const umi = useUmiStore.getState().umi;
  return umi.use(walletAdapterIdentity(wallet)).use(mplCore());
};
