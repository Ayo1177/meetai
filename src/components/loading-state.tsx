import {Loader2Icon } from "lucide-react"

interface Props {
    title: string;
    description: string;
}

export const LoadingState = ({ title, description }: Props) => {
    return (
        <div className="py-4 px- flex flex-1 items-center justify-center">
            <div className="flex flex-col items-center justify-center gap-y-6 bg-background roundedd-lg p-10 shadow-sm">
                <Loader2Icon className="size-6 animate-spin text-primary" />
                <div className="flex flex-col gap-y-2 text-center">
                    <h6 className="text-lg font-medius">{title}</h6>
                    <p className="text-sm">{description}</p>
                </div>
            </div>
        </div>
    )

}