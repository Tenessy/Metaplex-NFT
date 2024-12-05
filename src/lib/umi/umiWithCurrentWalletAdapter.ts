import useUmiStore from '@/store/useUmiStore';
import { signerIdentity, Umi } from '@metaplex-foundation/umi';

const umiWithCurrentWalletAdapter = (): Umi => {
  const umi = useUmiStore.getState().umi;
  const currentWallet = useUmiStore.getState().signer;
  if (!currentWallet) throw new Error('No wallet selected');
  return umi.use(signerIdentity(currentWallet));
};
export default umiWithCurrentWalletAdapter;
