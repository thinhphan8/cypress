import React from 'react';
import CustomDialogTrigger from "@/components/global/CustomDialogTrigger";
import SettingsForm from "@/components/settings/SettingsForm";

interface SettingsProps {
    children: React.ReactNode;
}

const Settings: React.FC<SettingsProps> = ({children}) => {
    return (
        <CustomDialogTrigger
            header="Settings"
            content={<SettingsForm/>}
        >
            {children}
        </CustomDialogTrigger>
    );
};

export default Settings;