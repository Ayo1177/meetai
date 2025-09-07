import { ResponsiveDialog } from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import { JSX, useState } from "react";

export const useConfirm = (): [JSX.Element | null, (title: string, description: string) => Promise<boolean>] => {
    const [promise, setPromise] = useState<{
        resolve: (value: boolean) => void;
        title: string;
        description: string;
    } | null>(null);

    const confirm = (title: string, description: string): Promise<boolean> => {
        return new Promise((resolve) => {
            setPromise({ resolve, title, description });
        });
    };

    const handleClose = () => {
        setPromise(null);
    };

    const handleConfirm = () => {
        promise?.resolve(true);
        handleClose();
    };

    const handleCancel = () => {
        promise?.resolve(false);
        handleClose();
    };

    const ConfirmationDialog = promise ? (
        <ResponsiveDialog
            title={promise.title}
            description={promise.description}
            open={promise !== null}
            onOpenChange={handleClose}
        >
            <div className="pt-4 w-full flex flex-col-reverse gap-y-4 lg:flex-row gap-x-2 items-center justify-end">
                <Button 
                    variant="outline" 
                    onClick={handleCancel}
                    className="w-full lg:w-auto"
                >
                    Cancel
                </Button>
                <Button 
                    onClick={handleConfirm}
                    className="w-full lg:w-auto"
                >
                    Confirm
                </Button>
            </div>
        </ResponsiveDialog>
    ) : null;

    return [ConfirmationDialog, confirm];
};