'use client';

import React, {useEffect} from 'react';
import {Subscription} from "@/lib/supabase/supabase.types";
import {useAppState} from "@/lib/providers/state-provider";
import {MAX_FOLDERS_FREE_PLAN} from "@/lib/constants";
import {Progress} from "@/components/ui/progress";
import CypressDiamondIcon from "@/components/icons/cypressDiamongIcon";

interface PlanUsageProps {
    foldersLength: number;
    subscription: Subscription | null;
}

const PlanUsage: React.FC<PlanUsageProps> = (
    {
        foldersLength,
        subscription,
    }
) => {
    const {workspaceId, state} = useAppState();
    const [usagePercentage, setUsagePercentage] = React.useState(
        foldersLength / MAX_FOLDERS_FREE_PLAN * 100
    );

    useEffect(() => {
        const stateFoldersLength = state.workspaces.find(
            (workspace) => workspace.id === workspaceId
        )?.folders.length;
        if (stateFoldersLength === undefined) {
            return;
        }
        setUsagePercentage((stateFoldersLength / MAX_FOLDERS_FREE_PLAN) * 100);
    }, [state, workspaceId]);

    return (
        <article className="mb-4">
            {subscription?.status !== "active" && (
                <div className="flex gap-2 text-muted-foreground mb-2 items-center">
                    <div className="w-4 h-4"><CypressDiamondIcon/></div>
                    <div className="flex justify-between w-full items-center">
                        <div>Free Plan</div>
                        <small>{usagePercentage.toFixed(0)}% / 100%</small>
                    </div>
                </div>
            )}
            {subscription?.status !== "active" && (
                <Progress
                    className="h-1"
                    value={usagePercentage}/>
            )}
        </article>
    );
};

export default PlanUsage;