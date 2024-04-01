import React from 'react';
import Link from 'next/link';

const Navbar = () => {
    return (
        <nav>
            <ul>
                <li>
                    <Link href="find">
                        发现
                    </Link>
                </li>
                <li>
                    <Link href="subscribe">
                        订阅
                    </Link>
                </li>
                <li>
                    <Link href="user">
                        我的
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;