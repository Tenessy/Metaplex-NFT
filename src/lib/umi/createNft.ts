import { create } from '@metaplex-foundation/mpl-core';
import {
  createGenericFileFromBrowserFile,
  generateSigner,
  Umi,
} from '@metaplex-foundation/umi';
import { base58 } from '@metaplex-foundation/umi/serializers';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

export const showBalance = async (
  publicKey: PublicKey
): Promise<number | null> => {
  const conn = new Connection(
    process.env.NEXT_PUBLIC_SOLANA_ENDPOINT as string,
    'confirmed'
  );
  const response = await conn.getAccountInfo(publicKey);

  if (response === null) {
    return null;
  }
  return response.lamports / LAMPORTS_PER_SOL;
};

// Step 1: Upload Image to AWS
export const generateImageUri = async (
  umi: Umi,
  file: File
): Promise<string[]> => {
  const umiImageFile = await createGenericFileFromBrowserFile(file, {
    tags: [{ name: 'Content-Type', value: file.type }],
  });
  console.log('Step 1: createGenericFileFromBrowserFile', umiImageFile);

  return umi.uploader.upload([umiImageFile]);
};

// Step 2: Upload Metadata to AWS
export const generateMetadataUri = async (
  imageUri: string[],
  umi: Umi
): Promise<string> => {
  const metadata = {
    name: 'My NFT',
    description: 'This is an NFT on Solana',
    image: imageUri[0],
    external_url: 'https://example.com',
    attributes: [
      {
        trait_type: 'trait1',
        value: 'value1',
      },
      {
        trait_type: 'trait2',
        value: 'value2',
      },
    ],
    properties: {
      files: [
        {
          uri: imageUri[0],
          type: 'image/png',
        },
      ],
      category: 'image',
    },
  };

  // Call upon umi's `uploadJson` function to upload our metadata to Arweave via Irys.

  console.log('Uploading Metadata...');
  return umi.uploader.uploadJson(metadata);
};

// Step 3: Create NFT
export const createNft = async (
  umi: Umi,
  metadataUri: string
): Promise<{
  transactionUri: string;
  nftExplorerUri: string;
}> => {
  // We generate a signer for the NFT
  const asset = generateSigner(umi);

  const tx = await create(umi, {
    asset,
    name: 'My NFT',
    uri: metadataUri,
  }).sendAndConfirm(umi);

  // Finally we can deserialize the signature that we can check on chain.
  const signature = base58.deserialize(tx.signature)[0];

  console.log('nftSigner', asset.publicKey.toString());

  // Log out the signature and the links to the transaction and the NFT.
  const transactionUri = `https://explorer.solana.com/tx/${signature}?cluster=devnet`;
  const nftExplorerUri = `https://core.metaplex.com/explorer/${asset.publicKey}?env=devnet`;
  console.log('Step 4: NFT Created');
  console.log('View Transaction on Solana Explorer');
  console.log(`https://explorer.solana.com/tx/${signature}?cluster=devnet`);
  console.log('\n');
  console.log('View NFT on Metaplex Explorer');
  console.log(
    `https://core.metaplex.com/explorer/${asset.publicKey}?env=devnet`
  );

  return { transactionUri, nftExplorerUri };
};
