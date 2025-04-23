"use client"
import { usePathname } from 'next/navigation'
import React from 'react'
import Navbar from './Navbar';
import Navbar_P from './(Partner)/Navbar_P';

function DynamicNavbar() {
    const pathname = usePathname();
    const ispartnerpath = pathname.startsWith("/partner")
    return (
        <div>
            {ispartnerpath ? <Navbar_P /> : <Navbar />}

        </div>
    )
}

export default DynamicNavbar
