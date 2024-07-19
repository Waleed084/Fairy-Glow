// assets
import { IconWallet, IconTablePlus } from '@tabler/icons-react';

// constant
const icons = {
  IconWallet,
  IconTablePlus
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const wallet = {
  id: 'wallet',
  title: 'Wallet Account',
  type: 'group',
  children: [
    {
      id: 'Wallets',
      title: 'Wallets',
      type: 'item',
      url: '/wallet/all',
      icon: icons.IconWallet
    },
    {
      id: 'Add Wallet',
      title: 'Add Wallet',
      type: 'item',
      url: '/wallet/add',
      icon: icons.IconTablePlus
    }
  ]
};

export default wallet;
