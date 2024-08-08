import React from 'react';
import {createServerActionClient} from "@supabase/auth-helpers-nextjs";
import {cookies} from "next/headers";
import {
    getCollaboratingWorkspaces,
    getFolders,
    getPrivateWorkspaces,
    getSharedWorkspaces,
    getUserSubscriptionStatus
} from "@/lib/supabase/queries";
import {redirect} from "next/navigation";
import {twMerge} from "tailwind-merge";
import WorkspaceDropdown from "@/components/sidebar/WorkspaceDropdown";

interface SidebarProps {
    params: { workspaceId: string };
    className?: string;
}

const Sidebar: React.FC<SidebarProps> = async (
    {
        params,
        className
    }
) => {
    const supabase = createServerActionClient({cookies});

    // User?
    const {
        data: {user}
    } = await supabase.auth.getUser();

    if (!user) {
        return;
    }

    // Subscription?
    const {
        data: subscriptionData,
        error: subscriptionError
    } = await getUserSubscriptionStatus(user.id);

    // Folders?
    const {
        data: workspaceFolderData,
        error: foldersError
    } = await getFolders(params.workspaceId);

    // Errors?
    if (subscriptionError || foldersError) {
        redirect('/dashboard');
    }

    // Get all the different workspaces (private/collaborating/shared/etc.)
    const [privateWorkspaces, collaboratingWorkspaces, sharedWorkspaces] =
        await Promise.all([
            getPrivateWorkspaces(user.id),
            getCollaboratingWorkspaces(user.id),
            getSharedWorkspaces(user.id),
        ]);

    return (
        <aside
            className={twMerge(
                "hidden sm:flex sm:flex-col w-[280px] shrink-0 p-4 md:gap-4 !justify-between",
                className
            )}
        >
            <div>
                <WorkspaceDropdown
                    privateWorkspaces={privateWorkspaces}
                    collaboratingWorkspaces={collaboratingWorkspaces}
                    sharedWorkspaces={sharedWorkspaces}
                    defaultValue={[
                        ...privateWorkspaces,
                        ...collaboratingWorkspaces,
                        ...sharedWorkspaces
                    ].find(workspace => workspace.id === params.workspaceId)}
                >

                </WorkspaceDropdown>
            </div>
        </aside>
    );
};

export default Sidebar;