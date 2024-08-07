import React from 'react';
import {createServerActionClient} from "@supabase/auth-helpers-nextjs";
import {cookies} from "next/headers";
import db from "@/lib/supabase/db";
import {redirect} from "next/navigation";
import DashboardSetup from "@/components/dashboard-setup/DashboardSetup";
import {getUserSubscriptionStatus} from "@/lib/supabase/queries";

const DashboardPage = async () => {
        const supabase = createServerActionClient({cookies});
        const {data: {user}} = await supabase.auth.getUser();

        if (!user) {
            return;
        }

        const workspace = await db.query.workspaces.findFirst({
            where: (workspace, {eq}) => eq(workspace.workspaceOwner, user.id),
        });

        const {
            data: subscription,
            error: subscriptionError
        } = await getUserSubscriptionStatus(user.id);

        if (subscriptionError) {
            return;
        }

        if (!workspace) {
            return (
                <div
                    className="
                bg-background
                w-screen
                h-screen
                flex
                justify-center
                items-center"
                >
                    <DashboardSetup
                        user={user}
                        subscription={subscription}
                    >

                    </DashboardSetup>
                </div>
            );
        }

        redirect(`/dashboard/${workspace.id}`);

        return (
            <div>
                Page
            </div>
        );
    }
;

export default DashboardPage;