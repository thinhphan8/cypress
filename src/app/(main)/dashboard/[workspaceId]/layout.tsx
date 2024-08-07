import React from 'react';
import Sidebar from "@/components/sidebar/Sidebar";

interface LayoutProps {
    children: React.ReactNode;
    params: any;
}

const Layout: React.FC<LayoutProps> = async ({children, params}) => {
    return (
        <main
            className="
            flex
            overflow-hidden
            w-screen
            h-screen"
        >
            <Sidebar params={params}/>
            <div
                className="
                dark:border-neutral-12/70
                border-l-[1px]
                w-full
                relative
                overflow-scroll"
            >
                {children}
            </div>
        </main>
    );
};

export default Layout;