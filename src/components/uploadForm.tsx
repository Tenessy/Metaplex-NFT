'use client';
import {
  createNft,
  generateImageUri,
  generateMetadataUri,
} from '@/lib/umi/createNft';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';
import { useWallet } from '@solana/wallet-adapter-react';
import { useState } from 'react';
import useUmiStore from '@/store/useUmiStore';
import Stepper from './stepper';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Typography,
} from '@material-tailwind/react';
import Confetti from './confetti';
import { DialogMaterial } from './dialog';
import { ListItems } from './list';
import { UploadItem } from '@/models/upload-item.model';

export default function UploadForm() {
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [nftExplorerUri, setNftExplorerUri] = useState<string>('');
  const [activeStep, setActiveStep] = useState<number>(0);
  const [items, setItems] = useState<UploadItem[]>([]);

  const wallet = useWallet();
  const umi = useUmiStore().umi;
  umi.use(walletAdapterIdentity(wallet));

  const deleteItem = (index: number): void => {
    setItems((prev) => {
      const newItems = [...prev];
      newItems.splice(index, 1);
      return newItems;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.prototype.slice.call(e.target.files) as File[];

      for (const file of files) {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = (): void => {
          const result = reader.result as string;
          const item = { imageUrl: result, title: file.name, file };
          setItems((prev) => {
            return [...prev, item];
          });
        };
      }
    }
  };

  async function uploadFile(
    evt: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    evt.preventDefault();
    if (!items.length) {
      throw new Error('Sélectionnez une image pour continuer');
    }
    const file = items[0].file;
    setLoading(true);
    // Create NFT
    const imageUri = await generateImageUri(umi, file).catch((err) => {
      setLoading(false);
      throw new Error(err);
    });
    // Step 1
    setActiveStep(1);
    const metaDataUri = await generateMetadataUri(imageUri, umi).catch(
      (err) => {
        setLoading(false);
        throw new Error(err);
      }
    );
    // Step 2
    setActiveStep(2);
    const { nftExplorerUri, transactionUri } = await createNft(
      umi,
      metaDataUri
    );
    setNftExplorerUri(nftExplorerUri);
    setActiveStep(3);
    setLoading(false);
    // Step 3
  }

  return (
    <>
      <div className='mt-4 flex flex-col max-w-3xl flex-column gap-2 items-center justify-center w-full mb-4'>
        <Card className='mt-6 w-full px-6'>
          <CardBody>
            <Stepper activeStep={activeStep} />
            <div className='flex gap-8 items-center justify-center w-full'>
              <label
                htmlFor='dropzone-file'
                className='flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600'
              >
                <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                  <svg
                    className='w-8 h-8 mb-4 text-gray-500 dark:text-gray-400'
                    aria-hidden='true'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 20 16'
                  >
                    <path
                      stroke='currentColor'
                      stroke-linecap='round'
                      stroke-linejoin='round'
                      stroke-width='2'
                      d='M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2'
                    />
                  </svg>
                  <p className='mb-2 text-sm text-gray-500 dark:text-gray-400'>
                    <span className='font-semibold'>Click to upload</span> or
                    drag and drop
                  </p>
                  <p className='text-xs text-gray-500 dark:text-gray-400'>
                    SVG, PNG, JPG or GIF (MAX. 800x400px)
                  </p>
                </div>
                <input
                  id='dropzone-file'
                  type='file'
                  accept='.png'
                  className='hidden'
                  onChange={handleFileChange}
                  multiple
                />
              </label>
            </div>
            <ListItems items={items} onDelete={deleteItem} />
          </CardBody>
          <CardFooter className='pt-0'>
            <Button
              loading={loading}
              className='flex items-center gap-3 justify-center'
              variant='gradient'
              color='deep-purple'
              onClick={uploadFile}
              size='lg'
              fullWidth
            >
              {loading ? (
                'En cours...'
              ) : (
                <>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                    className='size-5'
                  >
                    <path
                      fillRule='evenodd'
                      d='M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z'
                      clipRule='evenodd'
                    />
                  </svg>
                  Créer un NFT
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
      {activeStep === 3 && <Confetti confettiComplete={() => setOpen(true)} />}
      <DialogMaterial
        open={open}
        handleClose={() => {
          setOpen(false);
          setActiveStep(0);
          setItems([]);
        }}
      >
        <Typography color='deep-purple' variant='h4'>
          Votre NFT a été créé avec succès !
        </Typography>
        <Typography color='gray'>
          Vous pouvez le voir sur{' '}
          <a
            href={nftExplorerUri}
            target='_blank'
            rel='noopener noreferrer'
            className='text-primary-green'
          >
            Solana Explorer
          </a>
        </Typography>
      </DialogMaterial>
    </>
  );
}
