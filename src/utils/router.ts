import ProtectedLayout from '@/components/layout/protected'
import PublicLayout from '@/components/layout/public'
import RootLayout from '@/components/layout/root'
import LoginPage from '@/components/pages/auth/login'
import RegisterPage from '@/components/pages/auth/register'
import CategoryPage from '@/components/pages/categories/page'
import RootDashboard from '@/components/pages/dashboard/page'
import FeePage from '@/components/pages/fees/page'
import HousePage from '@/components/pages/houses/page'
import HousingPage from '@/components/pages/housing/page'
import OutcomePage from '@/components/pages/outcomes/page'
import PaymentPage from '@/components/pages/payments/page'
import CreateResidentPage from '@/components/pages/residents/create/page'
import { Resident } from '@/components/pages/residents/page'
import { createElement } from 'react'
import { createBrowserRouter, Navigate } from 'react-router'

const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      {
        index: true,
        element: createElement(Navigate, { to: '/dashboard', replace: true }),
      },
      {
        Component: PublicLayout,
        children: [
          {
            path: 'login',
            Component: LoginPage,
          },
          {
            path: 'register',
            Component: RegisterPage,
          },
        ],
      },
      {
        path: 'dashboard',
        Component: ProtectedLayout,
        children: [
          {
            index: true, 
            Component: RootDashboard,
          },
          {
            path: 'penghuni',
            Component: Resident,
          },
          {
            path: 'penghuni/create',
            Component: CreateResidentPage,
          },
          {
            path: 'categories',
            Component: CategoryPage,
          },
          {
            path: 'houses',
            Component: HousePage,
          },
          {
            path: 'housing',
            Component: HousingPage,
          },
          {
            path: 'fees',
            Component: FeePage,
          },
          {
            path: 'outcomes',
            Component: OutcomePage,
          },
          {
            path: 'payments',
            Component: PaymentPage,
          },
        ],
      },
    ],
  },
])

export default router
