'use client';

import React, {useEffect, useState} from 'react';
import {useAppState} from "@/lib/providers/state-provider";
import {Folder} from "@/lib/supabase/supabase.types";
import {createFolder} from "@/lib/supabase/queries";
import {useToast} from "@/components/ui/use-toast";
import {Accordion} from "@/components/ui/accordion";
import {PlusIcon} from "lucide-react";
import TooltipComponent from "@/components/global/TooltipComponent";
import Dropdown from "@/components/sidebar/Dropdown";
import {useSupabaseUser} from "@/lib/providers/supabase-user-provider";
import {useSubscriptionModal} from "@/lib/providers/subscription-modal-provider";
import {v4} from "uuid";

interface FoldersDropdownListProps {
    workspaceFolders: Folder[];
    workspaceId: string;
}

const FoldersDropdownList: React.FC<FoldersDropdownListProps> = (
    {
        workspaceFolders,
        workspaceId,
    }
) => {
    // Keep track local state of folders
    // Setup realtime update
    const {state, dispatch, folderId} = useAppState();
    const [folders, setFolders] = useState(workspaceFolders);
    const {toast} = useToast();
    const {subscription} = useSupabaseUser();
    const {open, setOpen} = useSubscriptionModal();

    // Effect that set initial state in server app state
    useEffect(() => {
        if (workspaceFolders.length > 0) {
            dispatch({
                type: "SET_FOLDERS",
                payload: {
                    workspaceId, folders: workspaceFolders.map((folder) => ({
                        ...folder, files: state.workspaces.find(
                            (workspace) => workspace.id === folder.id
                        )?.folders.find((f) => f.id === folder.id)?.files || [],
                    })),
                },
            });
        }
    }, [workspaceFolders, workspaceId]);

    // State
    useEffect(() => {
        setFolders(
            // @ts-ignore
            state.workspaces.find((workspace) => workspace.id === workspaceId)
                ?.folders || []
        );
    }, [state]);

    // Add folder
    const addFolderHandler = async () => {
        if (folders.length >= 3 && !subscription) {
            setOpen(true);
            return;
        }
        const newFolder: Folder = {
            data: null,
            id: v4(),
            createdAt: new Date().toISOString(),
            title: 'Untitled',
            iconId: '📄',
            inTrash: null,
            workspaceId,
            bannerUrl: '',
        };
        dispatch({
            type: 'ADD_FOLDER',
            payload: {workspaceId, folder: {...newFolder, files: []}},
        });
        const {data, error} = await createFolder(newFolder);
        if (error) {
            toast({
                title: 'Error',
                variant: 'destructive',
                description: 'Could not create the folder',
            });
        } else {
            toast({
                title: 'Success',
                description: 'Created folder.',
            });
        }
    };

    return (
        <>
            <div
                className="
                flex
                sticky
                z-20
                top-0
                bg-background
                w-full
                h-10
                group/title
                justify-between
                items-center
                pr-4
                text-Neutrals/neutrals-8"
            >
        <span
            className="
            text-Neutrals-8
            font-bold
            text-xs"
        >
          FOLDERS
        </span>
                <TooltipComponent message="Create Folder">
                    <PlusIcon
                        onClick={addFolderHandler}
                        size={16}
                        className="
                        group-hover/title:inline-block
                        hidden
                        cursor-pointer
                        hover:dark:text-white"
                    />
                </TooltipComponent>
            </div>
            <Accordion
                type="multiple"
                defaultValue={[folderId || '']}
                className="pb-20"
            >
                {folders
                    .filter((folder) => !folder.inTrash)
                    .map((folder) => (
                        <Dropdown
                            key={folder.id}
                            title={folder.title}
                            listType="folder"
                            id={folder.id}
                            iconId={folder.iconId}
                        />
                    ))}
            </Accordion>
        </>
    );
};

export default FoldersDropdownList;