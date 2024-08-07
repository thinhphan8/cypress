import React from 'react';
import Header from "@/components/landing-page/Header";

const HomePageLayout = ({children}: { children: React.ReactNode }) => {
    return (
        <main>
            <Header/>
            {children}
        </main>
    );
}

export default HomePageLayout;