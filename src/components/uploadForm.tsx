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

export default function UploadForm() {
  const wallet = useWallet();
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [nftExplorerUri, setNftExplorerUri] = useState<string>('');
  const [activeStep, setActiveStep] = useState<number>(0);
  const umi = useUmiStore().umi;
  umi.use(walletAdapterIdentity(wallet));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  async function uploadFile(
    evt: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    evt.preventDefault();
    if (file) {
      setIsLoading(true);
      // Create NFT
      const imageUri = await generateImageUri(umi, file).catch((err) => {
        setIsLoading(false);
        throw new Error(err);
      });
      // Step 1
      setActiveStep(1);
      const metaDataUri = await generateMetadataUri(imageUri, umi).catch(
        (err) => {
          setIsLoading(false);
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
      setIsLoading(false);
      // Step 3
    }
  }

  return (
    <>
      <div className='mt-4 flex flex-col max-w-4xl flex-column gap-2 items-center justify-center w-full mb-4'>
        <Card className='mt-6 w-full'>
          <CardBody>
            <div>
              <Stepper activeStep={activeStep} />
            </div>
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
                />
              </label>
            </div>
            {file && (
              <div className='flex py-6'>
                <svg
                  className='w-6 h-6 text-gray-800 dark:text-white'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  fill='none'
                  viewBox='0 0 24 24'
                >
                  <path
                    fill='currentColor'
                    d='M16 18H8l2.5-6 2 4 1.5-2 2 4Zm-1-8.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z'
                  />
                  <path
                    stroke='currentColor'
                    stroke-linecap='round'
                    stroke-linejoin='round'
                    stroke-width='2'
                    d='M10 3v4a1 1 0 0 1-1 1H5m14-4v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1ZM8 18h8l-2-4-1.5 2-2-4L8 18Zm7-8.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z'
                  />
                </svg>
                <span>{file.name}</span>
              </div>
            )}
          </CardBody>
          <CardFooter className='pt-0'>
            <Button
              loading={isLoading}
              className='flex items-center gap-3'
              variant='gradient'
              color='deep-purple'
              onClick={uploadFile}
              disabled={!file || isLoading}
            >
              {isLoading ? (
                'En cours...'
              ) : (
                <>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                    className='size-6'
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
          setFile(null);
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
