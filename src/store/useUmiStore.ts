import { mplCore } from '@metaplex-foundation/mpl-core';
import { Signer, Umi } from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { createSignerFromWalletAdapter } from '@metaplex-foundation/umi-signer-wallet-adapters';
import { WalletAdapter } from '@solana/wallet-adapter-base';
import { create } from 'zustand';
import { Connection } from '@solana/web3.js';
import awsUploaderS3 from '@/lib/aws/aws-uploader-s3';

const connection = (): Connection =>
  new Connection(process.env.NEXT_PUBLIC_SOLANA_ENDPOINT as string);

interface UmiState {
  umi: Umi;
  signer: Signer | undefined;
  updateSigner: (signer: WalletAdapter) => void;
}

const useUmiStore = create<UmiState>()((set, get) => ({
  // Replace URI with either hardcode, a const variable, or .env value
  umi: createUmi(connection()).use(mplCore()).use(awsUploaderS3()),
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
