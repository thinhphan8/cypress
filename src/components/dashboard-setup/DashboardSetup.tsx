"use client";

import React from 'react';
import {AuthUser} from "@supabase/supabase-js";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/Card";

interface DashboardSetupProps {
    user: AuthUser;
    subscription: {} | null;
}

const DashboardSetup: React.FC<DashboardSetupProps> = ({subscription, user,}) => {
    return (
        <Card
            className="
            h-screensm:h-auto"
        >
            <CardHeader>
                <CardTitle>
                    Create A Workspace
                </CardTitle>
                <CardDescription>
                    Lets create a private workspace to get you started.You can add
                    collaborators later from the workspace settings tab.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={() => {
                }}>
                    <div
                        className="
                        flex
                        flex-col
                        gap-4"
                    >
                        <div
                            className="
                            flex
                            items-center
                            gap-4"
                        >
                            <div className="text-5xl">

                            </div>
                        </div>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default DashboardSetup;