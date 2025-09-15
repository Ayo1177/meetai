import { GeneratedAvatar } from "@/components/generated-avatar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MeetingGetone } from "@/modules/meetings/types";
import { format } from "date-fns";
import { BookOpenIcon, ClockFadingIcon, FileTextIcon, FileVideoIcon, SparklesIcon} from "lucide-react";
import markdown from "react-markdown";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatDuration } from "@/lib/utils";
import Markdown from "react-markdown";

interface Props {
    data: MeetingGetone;
}

export const CompletedState = ({ data }: Props) => {
    return (
        <div className="flex flex-col gap-y-4">
            <Tabs defaultValue="summary">
                <div className="bg-white rounded-lg border px-3">
                    <ScrollArea>
                        <TabsList className="p-0 bg-background justify-start rounded-none h-12">
                            <TabsTrigger 
                            value="summary"
                            className="text-muted-foreground rounded-none bg-background data-[state=active]:text-foreground data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-b-primary data-[state=active]:text-accent-foreground h-full hover:text-accent-foreground flex items-center gap-2"
                            >
                                <BookOpenIcon className="h-4 w-4" />
                                Summary
                            </TabsTrigger>
                            <TabsTrigger 
                            value="transcript"
                            className="text-muted-foreground rounded-none bg-background data-[state=active]:text-foreground data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-b-primary data-[state=active]:text-accent-foreground h-full hover:text-accent-foreground flex items-center gap-2"
                            >
                                <FileTextIcon className="h-4 w-4" />
                                Transcript
                            </TabsTrigger>
                            <TabsTrigger 
                            value="recording"
                            className="text-muted-foreground rounded-none bg-background data-[state=active]:text-foreground data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-b-primary data-[state=active]:text-accent-foreground h-full hover:text-accent-foreground flex items-center gap-2"
                            >
                                <FileVideoIcon className="h-4 w-4" />
                                Recording
                            </TabsTrigger>
                            <TabsTrigger 
                            value="ask-ai"
                            className="text-muted-foreground rounded-none bg-background data-[state=active]:text-foreground data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-b-primary data-[state=active]:text-accent-foreground h-full hover:text-accent-foreground flex items-center gap-2"
                            >
                                <SparklesIcon className="h-4 w-4" />
                                Ask AI
                            </TabsTrigger>
                        </TabsList>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                </div>
                <TabsContent value="recording">
                    <div className="bg-white rounded-lg border p-4">
                        <video
                            src={data.recordingUrl!}
                            className="w-full rounded-lg"
                            controls
                        />
                    </div>
                </TabsContent>
                <TabsContent value="summary">
                    <div className="bg-white rounded-lg border p-4">
                        <div className="px-4 py-5 gap-y-5 flex flex-col col-span-5">
                            <h2 className="text-2xl font-medium capitalize">{data.name}</h2>
                            <div className="flex gap-x-2 items-center">
                                <Link
                                href= {'/agents/${data.agentId}'}
                                className="flex items-center gap-x-2 underline underline-offset-4 capitalize"
                                >
                                    <GeneratedAvatar
                                    variant="botttsNeutral"
                                    seed={data.agent.name}
                                    className="size-4"
                                    />
                                    {data.agent.name}
                                </Link>{` `}
                                <p>{data.startedAt? format(data.startedAt, "PPP") : "N/A"}</p>
                            </div>
                            <div className="flex gap-x-2 items-center">
                                <SparklesIcon className="size-4" />
                                <p>General Summary</p>
                            </div>
                            <Badge
                            variant="outline"
                            className="flex items-center gap-x-2 [&>svg]:size-4"
                            >
                                <ClockFadingIcon className="text-blue-700" />
                                {data.duration ? formatDuration(data.duration) : "no duration"}
                            </Badge>
                            <div>
                                {data.summaryUrl ? (
                                    <Markdown
                                    components={{
                                        h1: (props) => (
                                            <h1 className="text-2xl font-medium mb-6" {...props} />
                                        ),
                                        h2: (props) => (
                                            <h2 className="text-xl font-medium mb-4" {...props} />
                                        ),
                                        h3: (props) => (
                                            <h3 className="text-lg font-medium mb-3" {...props} />
                                        ),
                                        h4: (props) => (
                                            <ul className="text-base font-medium mb-2" {...props} />
                                        ),
                                        ul: (props) => (
                                            <ul className="list-disc list-inside mb-2" {...props} />
                                        ),
                                        li: (props) => (
                                            <li className="mb-1" {...props} />
                                        ),
                                        p: (props) => (
                                            <p className="mb-2" {...props} />
                                        ),
                                        a: (props) => (
                                            <a className="text-blue-700 underline" {...props} />
                                        ),
                                        ol: (props) => (
                                            <ol className="list-decimal list-inside mb-2" {...props} />
                                        ),
                                        strong: (props) => (
                                            <strong className="font-medium" {...props} />
                                        ),
                                        em: (props) => (
                                            <em className="italic" {...props} />
                                        ),
                                        code: (props) => (
                                            <code className="bg-muted rounded-md px-1 py-0.5" {...props} />
                                        ),
                                        blockquote: (props) => (
                                            <blockquote className="border-l-2 border-muted-foreground pl-4" {...props} />
                                        ),

                                    }}
                                    >
                                        {data.summaryUrl}
                                    </Markdown>
                                ) : (
                                    <p className="text-muted-foreground">Summary not available yet</p>
                                )}
                            </div>
                        </div>

                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}