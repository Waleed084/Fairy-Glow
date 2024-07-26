import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

// Payment routing
const TraningBonus = Loadable(lazy(() => import('views/pages/training-bonus/TrainingBonus')));
const UploadTraningBonus = Loadable(lazy(() => import('views/pages/training-bonus/UploadTrainingBonus')));
const Invest = Loadable(lazy(() => import('views/pages/invest/Invest')));
const ReferralPaymentVerification = Loadable(lazy(() => import('views/pages/invest/ReferralPaymentVerification')));
const WithDraw = Loadable(lazy(() => import('views/pages/WithDraw')));
const MoneyTransfer = Loadable(lazy(() => import('views/pages/MoneyTransfer')));
// Transaction routing
const AllTransaction = Loadable(lazy(() => import('views/utilities/AllTransaction')));
const DepositHistory = Loadable(lazy(() => import('views/utilities/DepositHistory')));
const WithdrawHistory = Loadable(lazy(() => import('views/utilities/WithdrawHistory')));
const TrainingBonusHistory = Loadable(lazy(() => import('views/utilities/TrainingBonusHistory')));
const InvestmentHistory = Loadable(lazy(() => import('views/utilities/InvestmentHistory')));
// Wallet routing
const Wallet = Loadable(lazy(() => import('views/wallet/Wallet')));
const AddWallet = Loadable(lazy(() => import('views/wallet/AddWallet')));
const PasswordChange = Loadable(lazy(() => import('../layout/MainLayout/Header/ProfileSection/PasswordChange')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'Transactions',
      children: [
        {
          path: 'all-transactions',
          element: <AllTransaction />
        }
      ]
    },
    {
      path: 'Transactions',
      children: [
        {
          path: 'deposit-history',
          element: <DepositHistory />
        }
      ]
    },
    {
      path: 'Transactions',
      children: [
        {
          path: 'withdraw-history',
          element: <WithdrawHistory />
        }
      ]
    },
    {
      path: 'Transactions',
      children: [
        {
          path: 'training-bonus-history',
          element: <TrainingBonusHistory />
        }
      ]
    },
    {
      path: 'Transactions',
      children: [
        {
          path: 'investment-history',
          element: <InvestmentHistory />
        }
      ]
    },
    {
      path: 'wallet',
      children: [
        {
          path: 'all',
          element: <Wallet />
        }
      ]
    },
    {
      path: 'wallet',
      children: [
        {
          path: 'add',
          element: <AddWallet />
        }
      ]
    },
    {
      path: 'payments',
      children: [
        {
          children: [
            {
              path: 'training-bonus',
              element: <TraningBonus />
            },
            {
              path: 'upload',
              element: <UploadTraningBonus />
            }
          ]
        },
        {
          path: 'referral',
          children: [
            {
              path: 'plans',
              element: <Invest />
            },
            {
              path: 'upload',
              element: <ReferralPaymentVerification />
            }
          ]
        },
        {
          path: 'withdraw',
          element: <WithDraw />
        },
        {
          path: 'money-transfer',
          element: <MoneyTransfer />
        }
      ]
    },
    {
      path: '/password-change',
      element: <PasswordChange />
    }
  ]
};

export default MainRoutes;
