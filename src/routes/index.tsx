import React from 'react';
import { useRoutes } from 'react-router-dom';
import AdminRoutes from '../admin-app/AdminRoutes';
import Casino from '../pages/casino/casino';
import CasinoOther from '../pages/casino/casinoOther';
import Deposit from '../pages/deposit/deposit';
import Withdraw from '../pages/withdraw/withdraw';
import DepositStatement from '../pages/depositstatement/depositstatement';
import WithdrawStatement from '../pages/withdrawstatement/withdrawstatement';
import Morbet from '../pages/morebet/morbet';

const AccountStatement = React.lazy(
  () => import('../pages/AccountStatement/AccountStatement')
);
const BetHistory = React.lazy(() => import('../pages/BetHistory/BetHistory'));
const ButtonValues = React.lazy(
  () => import('../pages/button-values/button-values')
);
const CasinoReport = React.lazy(
  () => import('../pages/CasinoReport/CasinoReport')
);
const ChangePassword = React.lazy(
  () => import('../pages/ChangePassword/ChangePassword')
);
const Dashboard = React.lazy(() => import('../pages/dashboard/dashboard'));
const Login = React.lazy(() => import('../pages/login/login'));
const Odds = React.lazy(() => import('../pages/odds/odds'));
const ProfitLoss = React.lazy(() => import('../pages/PlReport/ProfitLoss'));
const UnsetteleBetHistory = React.lazy(
  () => import('../pages/UnsetteleBetHistory/UnsetteleBetHistory')
);
const AuthLayout = React.lazy(() => import('../pages/_layout/AuthLayout'));
const Main = React.lazy(() => import('../pages/_layout/Main'));
const CasinoList = React.lazy(() => import('../pages/CasinoList/CasinoList'));
const Rules = React.lazy(() => import('../pages/Rules/rules'));
const TransactionPassword = React.lazy(
  () => import('../admin-app/pages/transaction-password/transaction-password')
);
const CheckTransactionPassword = React.lazy(
  () => import('../pages/_layout/CheckTransactionPassword')
);
const Page404 = React.lazy(() => import('../pages/404/404'));
const CasinoWrapper = React.lazy(
  () => import('../pages/CasinoList/CasinoWrapper')
);
const ResultList = React.lazy(
  () => import('../pages/CasinoList/component/_common/ResultList')
);
const SecurityAuth = React.lazy(() => import('../pages/Rules/SecurityAuth'));

// Error boundary component to catch JavaScript errors
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-container p-4">
          <h2>Something went wrong loading this page</h2>
          <p>Please refresh the page or try again later.</p>
          <button
            className="btn btn-primary mt-2"
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const Routers = () => {
  const routes = [
    {
      path: '/morbet',
      element: <Morbet />,
    },
    {
      path: '/login',
      element: <AuthLayout />,
      children: [{ index: true, element: <Login /> }],
    },
    {
      path: '/transaction-password',
      element: <TransactionPassword />,
    },
    {
      path: '/admin/transaction-password',
      element: <TransactionPassword />,
    },
    {
      path: '/',
      element: <CheckTransactionPassword />,
      children: [
        { path: 'maintenance', element: <h4>Under Main</h4> },
        {
          path: '/',
          element: <Main />,
          children: [
            { index: true, element: <Dashboard /> },
            { path: 'dashbaord', element: <Dashboard /> },
            { path: 'match/:sportId', element: <Dashboard /> },
            { path: 'match/:sportId/:status?', element: <Dashboard /> },
            { path: 'odds/:matchId', element: <Odds /> },
            { path: 'button-values', element: <ButtonValues /> },
            { path: '/changepassword', element: <ChangePassword /> },
            { path: '/bethistory', element: <BetHistory /> },
            { path: '/deposit', element: <Deposit /> },
            { path: '/withdraw', element: <Withdraw /> },
            { path: '/accountstatement', element: <AccountStatement /> },
            { path: '/unsettledbet', element: <UnsetteleBetHistory /> },
            { path: '/casinoreport', element: <CasinoReport /> },
            { path: '/profitloss', element: <ProfitLoss /> },
            { path: '/casino-games', element: <CasinoList /> },
            { path: '/casino-in/:type', element: <Casino /> },
            { path: '/casino-int/:type', element: <CasinoOther /> },
            { path: '/rules', element: <Rules /> },
            { path: '/casino/:gameCode/:matchId', element: <CasinoWrapper /> },
            { path: '/casino/result', element: <ResultList /> },
            { path: '/casino/result/:matchid', element: <ResultList /> },
            { path: 'settings/security-auth', element: <SecurityAuth /> },
            { path: '/depositstatement', element: <DepositStatement /> },
            { path: '/withdrawstatement', element: <WithdrawStatement /> },
          ],
        },
        ...AdminRoutes(),
      ],
    },
    { path: '*', element: <Page404 /> },
  ];
  return useRoutes(routes);
};

const AppRoutes: React.FC = () => {
  return (
    <ErrorBoundary>
      <Routers />
    </ErrorBoundary>
  );
};

export default AppRoutes;
