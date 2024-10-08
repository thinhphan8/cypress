import React from 'react';
import {getFolderDetails} from "@/lib/supabase/queries";
import {redirect} from "next/navigation";
import QuillEditor from "@/components/quill-editor/QuillEditor";

const FolderPage = async ({params}: { params: { folderId: string } }) => {
    const {data, error} = await getFolderDetails(params.folderId);
    if (error || !data.length) redirect('/dashboard');

    return (
        <div className="relative">
            <QuillEditor
                dirType="folder"
                fileId={params.folderId}
                dirDetails={data[0] || {}}
            />
        </div>
    );
};

export default FolderPage;