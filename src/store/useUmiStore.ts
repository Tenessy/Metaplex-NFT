import { mplCore } from '@metaplex-foundation/mpl-core';
import {
  Signer,
  Umi,
  createNoopSigner,
  createNullSigner,
  publicKey,
  signerIdentity,
} from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { createSignerFromWalletAdapter } from '@metaplex-foundation/umi-signer-wallet-adapters';
import { WalletAdapter } from '@solana/wallet-adapter-base';
import { create } from 'zustand';
import { clusterApiUrl } from '@solana/web3.js';

interface UmiState {
  umi: Umi;
  signer: Signer | undefined;
  updateSigner: (signer: WalletAdapter) => void;
}

const useUmiStore = create<UmiState>()((set, get) => ({
  // Replace URI with either hardcode, a const variable, or .env value
  umi: createUmi('https://api.devnet.solana.com').use(mplCore()),
  signer: undefined,
  updateSigner: (signer) => {
    const currentSigner = get().signer;
    const newSigner = createSignerFromWalletAdapter(signer);

    if (
      !currentSigner ||
      currentSigner.publicKey.toString() !== newSigner.publicKey.toString()
    ) {
      set(() => ({ signer: newSigner }));
    }
  },
}));

export default useUmiStore;
