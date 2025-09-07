"use client"

import { ResponsiveDialog } from "@/components/responsive-dialog"
import { MeetingForm } from "./meeting-form"
import { useRouter } from "next/navigation"
import { MeetingGetone } from "@/modules/meetings/types"

interface UpdateMeetingDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    initialValues: MeetingGetone
}

export const UpdateMeetingDialog = ({
    open,
    onOpenChange,
    initialValues
}: UpdateMeetingDialogProps) => {



    return (
        <ResponsiveDialog
            title="Edit Meeting"
            description="Edit Meeting Details"
            open={open}
            onOpenChange={onOpenChange}
        >
            <MeetingForm
                onSuccess={() => {onOpenChange(false)}}
                onCancel={() => onOpenChange(false)}
                initialValues={initialValues}
            />
        </ResponsiveDialog>
    )
}