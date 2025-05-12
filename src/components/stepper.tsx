'use client';
import React from 'react';
import { Stepper, Step } from '@material-tailwind/react';
import {
  PhotoIcon,
  DocumentIcon,
  BoltIcon,
  CloudIcon,
} from '@heroicons/react/24/outline';

interface StepperMaterialProps {
  activeStep: number;
}

const StepperMaterial = ({ activeStep }: StepperMaterialProps) => {
  return (
    <div className='w-full py-6'>
      <Stepper style={{ zIndex: 1 }} activeStep={activeStep}>
        <Step>
          <PhotoIcon className='h-5 w-5' />
        </Step>
        <Step>
          <CloudIcon className='h-5 w-5' />
        </Step>
        <Step>
          <DocumentIcon className='h-5 w-5' />
        </Step>
        <Step>
          <BoltIcon className='h-5 w-5' />
        </Step>
      </Stepper>
    </div>
  );
};

export default StepperMaterial;
