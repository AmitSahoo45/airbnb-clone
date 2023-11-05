import './globals.css'
import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'

import Navbar from './components/Navbar/Navbar';
import ClientOnly from './components/ClientOnly';
import RegisterModal from './components/Modals/RegisterModal';
import ToasterProvider from './providers/ToasterProvider';
import LoginModal from './components/Modals/LoginModal';
import getCurrentUser from './actions/currentuser';
import RentModal from './components/Modals/RentModal';
import SearchModal from './components/Modals/SearchModal';

const NunitoFont = Nunito({
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: 'Airbnb',
  description: 'Airbnb clone',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const currentUser = await getCurrentUser();

  return (
    <html lang="en">
      <body className={NunitoFont.className}>
        <ClientOnly>
          <ToasterProvider />
          <SearchModal />
          <RentModal />
          <LoginModal />
          <RegisterModal />
          <Navbar currentUser={currentUser} />
        </ClientOnly>
        <main className='pb-20 pt-28'>
          {children}
        </main>
      </body>
    </html>
  )
}
