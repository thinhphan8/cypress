'use client';

import React, {useEffect, useRef, useState} from 'react';
import {useToast} from "@/components/ui/use-toast";
import {useAppState} from "@/lib/providers/state-provider";
import {useSupabaseUser} from "@/lib/providers/supabase-user-provider";
import {User, workspace} from "@/lib/supabase/supabase.types";
import {Briefcase, Lock, Plus, Share} from "lucide-react";
import {Separator} from "@/components/ui/separator";
import {useRouter} from "next/navigation";
import {createClientComponentClient} from "@supabase/auth-helpers-nextjs";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {addCollaborators, deleteWorkspace, removeCollaborators, updateWorkspace} from "@/lib/supabase/queries";
import {v4} from "uuid";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {SelectGroup} from "@radix-ui/react-select";
import CollaboratorSearch from "@/components/global/CollaboratorSearch";
import {Button} from "@/components/ui/button";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Alert, AlertDescription} from "@/components/ui/alert";

const SettingsForm = () => {
    const {toast} = useToast();
    const {user} = useSupabaseUser();
    const router = useRouter();
    const supabase = createClientComponentClient();
    const {state, workspaceId, dispatch} = useAppState();
    const [permissions, setPermissions] = useState("private");
    const [collaborators, setCollaborators] = useState<User[] | []>([]);
    const [openAlertMessage, setOpenAlertMessage] = useState(false);
    const [workspaceDetails, setWorkspaceDetails] = useState<workspace>();
    const titleTimerRef = useRef<ReturnType<typeof setTimeout>>();
    const [uploadingProfilePic, setUploadingProfilePic] = useState(false);
    const [uploadingLogo, setUploadingLogo] = useState(false);

    // WIP Payment Portal

    // Add Collaborators
    const addCollaborator = async (profile: User) => {
        if (!workspaceId) {
            return;
        }
        // WIP Subscription
        // if (subscription?.status !== 'active' && collaborators.length >= 2) {
        //     setOpen(true);
        //     return;
        // }
        await addCollaborators(collaborators, workspaceId);
        setCollaborators([...collaborators, profile]);
        // Refresh workspace categories
        router.refresh();
    };
    // Remove Collaborators
    const removeCollaborator = async (user: User) => {
        if (!workspaceId) {
            return;
        }
        if (collaborators.length === 1) {
            setPermissions('private');
        }
        await removeCollaborators([user], workspaceId);
        setCollaborators(collaborators.filter((c) => c.id !== user.id));
        router.refresh();
    };
    // onChange Workspace Title
    // onChange
    const workspaceNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!workspaceId || !e.target.value) {
            return;
        }
        dispatch({
            type: 'UPDATE_WORKSPACE',
            payload: {workspace: {title: e.target.value}, workspaceId},
        });
        if (titleTimerRef.current) clearTimeout(titleTimerRef.current);
        titleTimerRef.current = setTimeout(async () => {
            await updateWorkspace({title: e.target.value}, workspaceId);
        }, 500);
    }

    const onChangeWorkspaceLogo = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (!workspaceId) {
            return;
        }
        const file = e.target.files?.[0];
        if (!file) {
            return;
        }
        const uuid = v4();
        setUploadingLogo(true);
        const {data, error} = await supabase
            .storage
            .from('workspace-logos')
            .upload(`workspaceLogo.${uuid}`, file, {
                cacheControl: '3600',
                upsert: true,
            });

        if (!error) {
            dispatch({
                type: 'UPDATE_WORKSPACE',
                payload: {workspace: {logo: data.path}, workspaceId},
            });
            await updateWorkspace({logo: data.path}, workspaceId);
            setUploadingLogo(false);
        }
    };

    const onPermissionsChange = (val: string) => {
        if (val === 'private') {
            setOpenAlertMessage(true);
        } else setPermissions(val);
    };


    // onClicks
    // Fetching Avatar Details
    // Get Workspace Details
    // Get all the collaborators
    // WIP Payment Portal redirect

    useEffect(() => {
        const showingWorkspace = state.workspaces.find(
            (workspace) => workspace.id === workspaceId
        );
        if (showingWorkspace) setWorkspaceDetails(showingWorkspace);
    }, [workspaceId, state]);

    return (
        <div className="flex flex-col gap-4">
            <p className="flex items-center gap-2 mt-6">
                <Briefcase size={20}/>
                Workspace
            </p>
            <Separator/>
            <div className="flex flex-col gap-2">
                <Label
                    htmlFor="workspaceName"
                    className="text-sm text-muted-foreground"
                >
                    Name
                </Label>
                <Input
                    name="workspaceName"
                    value={workspaceDetails ? workspaceDetails.title : ''}
                    placeholder="Workspace Name"
                    onChange={workspaceNameChange}
                />
                <Label
                    htmlFor="workspaceLogo"
                    className="text-sm text-muted-foreground"
                >
                    Workspace Logo
                </Label>
                <Input
                    name="workspaceName"
                    type="file"
                    accept="image/*"
                    placeholder="Workspace Logo"
                    onChange={onChangeWorkspaceLogo}
                    // WIP Subscription
                    disabled={uploadingLogo}
                />
                {/*Subscription*/}
                <Label
                    htmlFor="permissions"
                    className="text-sm text-muted-foreground mb-3"
                >
                    Permission
                </Label>
                <Select
                    onValueChange={(val) => {
                        setPermissions(val);
                    }}
                    defaultValue={permissions}
                >
                    <SelectTrigger className="w-full h-26 -mt-3">
                        <SelectValue/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="private">
                                <div
                                    className="
                                    p-2
                                    flex
                                    gap-4
                                    justify-center
                                    items-center"
                                >
                                    <Lock/>
                                    <article className="text-left flex flex-col">
                                        <span>Private</span>
                                        <p>
                                            Your workspace is private to you. You can choose to share
                                            it later.
                                        </p>
                                    </article>
                                </div>
                            </SelectItem>
                            <SelectItem value="shared">
                                <div className="p-2 flex gap-4 justify-center items-center">
                                    <Share></Share>
                                    <article className="text-left flex flex-col">
                                        <span>Shared</span>
                                        <span>You can invite collaborators.</span>
                                    </article>
                                </div>
                            </SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
                {permissions === 'shared' && (
                    <div>
                        <CollaboratorSearch
                            existingCollaborators={collaborators}
                            getCollaborator={(user) => {
                                addCollaborator(user).then();
                            }}
                        >
                            <Button
                                type="button"
                                className="text-sm mt-4"
                            >
                                <Plus/>
                                Add Collaborators
                            </Button>
                        </CollaboratorSearch>
                        <div className="mt-4">
                        <span className="text-sm text-muted-foreground">
                          Collaborators {collaborators.length || ''}
                        </span>
                            <ScrollArea
                                className="
                            h-[120px]
                            overflow-y-auto
                            w-full
                            rounded-md
                            border
                            border-muted-foreground/20"
                            >
                                {collaborators.length ? (
                                    collaborators.map((c) => (
                                        <div
                                            className="
                                        py-4
                                        px-2
                                        flex
                                        justify-between
                                        items-center"
                                            key={c.id}
                                        >
                                            <div className="flex gap-1 items-center">
                                                <Avatar>
                                                    <AvatarImage src="/avatars/7.png"/>
                                                    <AvatarFallback>PJ</AvatarFallback>
                                                </Avatar>
                                                <div
                                                    className="
                                                text-sm
                                                text-muted-foreground
                                                overflow-hidden
                                                overflow-ellipsis
                                                sm:w-[300px]
                                                w-[140px]"
                                                >
                                                    {c.email}
                                                </div>
                                            </div>
                                            <Button
                                                variant="secondary"
                                                onClick={() => removeCollaborator(c)}
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    ))
                                ) : (
                                    <div
                                        className="
                                    absolute
                                    right-0
                                    left-0
                                    top-0
                                    bottom-0
                                    flex
                                    justify-center
                                    items-center"
                                    >
                                  <span className="text-muted-foreground text-sm">
                                    You have no collaborators
                                  </span>
                                    </div>
                                )}
                            </ScrollArea>
                        </div>
                    </div>
                )}
                <Alert variant={'destructive'}>
                    <AlertDescription>
                        Warning! deleting you workspace will permanently delete all data
                        related to this workspace.
                    </AlertDescription>
                    <Button
                        type="submit"
                        size={'sm'}
                        variant={'destructive'}
                        className="
                        mt-4
                        text-sm
                        bg-destructive/40
                        border-2
                        border-destructive"
                        onClick={async () => {
                            if (!workspaceId) return;
                            await deleteWorkspace(workspaceId);
                            toast({title: 'Successfully deleted your workspace'});
                            dispatch({type: 'DELETE_WORKSPACE', payload: workspaceId});
                            router.replace('/dashboard');
                        }}
                    >
                        Delete Workspace
                    </Button>
                </Alert>
            </div>
        </div>
    );
};

export default SettingsForm;