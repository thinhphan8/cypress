import React from 'react';
import {twMerge} from "tailwind-merge";
import Link from "next/link";
import CypressHomeIcon from "@/components/icons/cypressHomeIcon";
import CypressSettingsIcon from "@/components/icons/cypressSettingsIcon";
import CypressTrashIcon from "@/components/icons/cypressTrashIcon";

interface NativeNavigationProps {
    myWorkspaceId: string;
    className?: string;
}

const NativeNavigation: React.FC<NativeNavigationProps> = (
    {
        myWorkspaceId,
        className,
    }
) => {
    return (
        <nav className={twMerge("my-2", className)}>
            <ul className="flex flex-col gap-2">
                <li>
                    <Link
                        className="
                        group/native
                        flex
                        text-Neutrals/neutrals-7
                        transition-all
                        gap-2"
                        href={`dashboard/${myWorkspaceId}`}
                    >
                        <CypressHomeIcon/>
                        <span>My Workspace</span>
                    </Link>
                </li>
                <li>
                    <Link
                        className="
                        group/native
                        flex
                        text-Neutrals/neutrals-7
                        transition-all
                        gap-2"
                        href={`dashboard/${myWorkspaceId}`}
                    >
                        <CypressSettingsIcon/>
                        <span>Settings</span>
                    </Link>
                </li>
                <li>
                    <Link
                        className="
                        group/native
                        flex
                        text-Neutrals/neutrals-7
                        transition-all
                        gap-2"
                        href={`dashboard/${myWorkspaceId}`}
                    >
                        <CypressTrashIcon/>
                        <span>Trash</span>
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default NativeNavigation;