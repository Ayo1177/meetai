import { MeetingStatus } from "@/modules/meetings/types"
import {
    CircleCheckIcon,
    CircleXIcon,
    ClockArrowUpIcon,
    LoaderIcon,
    VideoIcon
} from "lucide-react"
import { CommandSelect } from "./command-select"
import { useMeetingsFilters } from "@/modules/meetings/hooks/use-meetings-filters"

const options = [
    {
        id: MeetingStatus.UPCOMING,
        value: MeetingStatus.UPCOMING,
        label: MeetingStatus.UPCOMING,
        children: (
            <div className="flex items-center gap-2">
                <ClockArrowUpIcon />
                {MeetingStatus.UPCOMING}
            </div>
        )
    },
    {
        id: MeetingStatus.COMPLETED,
        value: MeetingStatus.COMPLETED,
        label: MeetingStatus.COMPLETED,
        children: (
            <div className="flex items-center gap-2">
                <CircleCheckIcon />
                {MeetingStatus.COMPLETED}
            </div>
        )
    },
    {
        id: MeetingStatus.PROCESSING,
        value: MeetingStatus.PROCESSING,
        label: MeetingStatus.PROCESSING,
        children: (
            <div className="flex items-center gap-2">
                <LoaderIcon />
                {MeetingStatus.PROCESSING}
            </div>
        )
    },
    {
        id: MeetingStatus.CANCELLED,
        value: MeetingStatus.CANCELLED,
        label: MeetingStatus.CANCELLED,
        children: (
            <div className="flex items-center gap-2">
                <CircleXIcon />
                {MeetingStatus.CANCELLED}
            </div>
        )
    },
    {
        id: MeetingStatus.ACTIVE,
        value: MeetingStatus.ACTIVE,
        label: MeetingStatus.ACTIVE,
        children: (
            <div className="flex items-center gap-2">
                <VideoIcon />
                {MeetingStatus.ACTIVE}
            </div>
        )
    },
]

export const StatusFilter = () => {
    const [filters, setFilters] = useMeetingsFilters()
    return (
        <CommandSelect
            placeholder="Status"
            className="h-9 w-[200px]"
            options={options}
            onSelect={(value) => setFilters({ status: value as MeetingStatus })}
            value={filters.status ?? ""}
        />
    )
}