import { ChevronsUpDownIcon } from "lucide-react";  

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import {
    CommandEmpty,
    CommandInput,
    CommandItem,
    CommandList,
    CommandResponsiveDialog
} from "@/components/ui/command";
import { useState } from "react";


interface Props {
    options: Array<{
        id: string;
        value: string;
        children: React.ReactNode;
    }>;
    onSelect: (value: string) => void;
    onSearch?: (value: string) => void;
    value: string;
    placeholder: string;
    isSearchable?: boolean;
    className?: string;
}

export const CommandSelect = ({ 
    options, 
    onSelect,
    onSearch, 
    placeholder, 
    value, 
    isSearchable, 
    className 
}: Props) => {
    const [open, setOpen] = useState(false);
    const selectedOption = options?.find(option => option.id === value);

    const handleOpenChange = (open : boolean) => {
        onSearch?.("");
        setOpen(open);
    }


    return (
        <>
            <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(true)}
                className={cn(
                    "w-full justify-between",
                    !selectedOption && "text-muted-foreground",
                    className
                )}
            >
                <div>
                    {selectedOption?.children ?? placeholder}
                </div>
                <ChevronsUpDownIcon />
            </Button>
            <CommandResponsiveDialog 
                shouldFilter={!onSearch}
                open={open} 
                onOpenChange={handleOpenChange}
            >
                <CommandInput 
                    placeholder="Search..."
                    onValueChange={onSearch}
                />
                <CommandList>
                    <CommandEmpty>
                        <span className="text-sm text-muted-foreground">
                            No Options
                        </span>
                    </CommandEmpty>
                    {options?.map((option) => (
                        <CommandItem
                            key={option.id}
                            value={option.id}
                            onSelect={() => {
                                onSelect(option.value);
                                setOpen(false);
                            }}
                        >
                            {option.children}
                        </CommandItem>
                    ))}
                </CommandList>
            </CommandResponsiveDialog>
        </>
    )
}

