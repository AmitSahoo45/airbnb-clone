import React from 'react'

import Container from '../Container/Container'
import Logo from './Logo/Logo'
import Search from './Search/Search'
import UserMenu from './UserMenu/UserMenu'
import { SafeUser } from '@/app/types'
import Categories from './Categories/Categories'

interface NavbarProps {
    currentUser?: SafeUser | null;
}

// TS tip
/*
when defining NavbarProps, we can use the ? operator in the interface to make a prop optional.
*/

const Navbar: React.FC<NavbarProps> = ({
    currentUser
}) => {

    return (
        <div className="fixed w-full bg-white z-10 shadow-sm">
            <div className="py-4 border-b-[1px]">
                <Container>
                    <div className="flex flex-row items-center justify-between gap-3 md:gap-0">
                        <Logo />
                        <Search />
                        <UserMenu currentUser={currentUser} />
                    </div>
                </Container>
            </div>
            <Categories />
        </div>
    )
}


export default Navbar