'use client';
import createNft from '@/lib/umi/createNft';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRef } from 'react';
import useUmiStore from '@/store/useUmiStore';
import { generateSigner, signerIdentity } from '@metaplex-foundation/umi';
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';
import { createUmi } from '@metaplex-foundation/umi-bundle-tests';

export default function UploadForm() {
  const wallet = useWallet();
  const fileInput = useRef<HTMLInputElement>(null);

  async function uploadFile(
    evt: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    evt.preventDefault();

    if (!fileInput) return;

    const umi = await createUmi('https://api.devnet.solana.com');
    umi.use(walletAdapterIdentity(wallet))

    const file = fileInput.current?.files?.[0] as File;
    // Create NFT
    await createNft(umi, file);
  }

  return (
    <form className='flex flex-col gap-4'>
      <label>
        <span>Télécharger une image</span>
        <input type='file' name='file' accept='.png' ref={fileInput} />
      </label>
      <button type='submit' onClick={uploadFile} disabled={!fileInput}>
        Créer un NFT
      </button>
    </form>
  );
}
