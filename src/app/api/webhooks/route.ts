import { db } from "@/db";
import { meetings, agents } from "@/db/schema";
import { StreamVideo } from "@stream-io/video-react-sdk";
import { and, eq, not, or } from "drizzle-orm";
import {
    CallEndedEvent,
    CallTranscriptionReadyEvent,
    CallRecordingReadyEvent,
    CallSessionStartedEvent,
    CallSessionParticipantLeftEvent,
    CallSessionEndedEvent,
} from "@stream-io/video-react-sdk";
import { NextRequest, NextResponse } from "next/server";
import { streamVideo } from "@/lib/stream-video";
import { inngest } from "@/inngest/client";

function verifySignatureWithSDK(body: string, signature: string): boolean {
    // Use the correct streamVideo instance, not the React component
    return streamVideo.verifyWebhook(body, signature);
}

export async function POST(req: NextRequest) {
    const signature = req.headers.get("x-signature")
    const apiKey = req.headers.get("x-api-key")

    if (!signature || !apiKey) {
        return NextResponse.json(
            { error: "Missing signature or api key" },
            { status: 400 }
        );
    }

    const body = await req.text();

    if (!verifySignatureWithSDK(body, signature)) {
        return NextResponse.json(
            { error: "Invalid signature" },
            { status: 400 }
        );
    }
    
    let payload: unknown;
    try {
        payload = JSON.parse(body) as Record<string, unknown>
    } catch (error) {
        return NextResponse.json(
            { error: "Invalid JSON" },
            { status: 400 }
        );
    }

    const eventType = (payload as Record<string, unknown>)?.type

    if (eventType === "call.session_started") {
        const event = payload as CallSessionStartedEvent
        const meetingId = event.call.custom?.meetingId

    if (!meetingId) {
        return NextResponse.json(
            { error: "Missing meeting id" },
            { status: 400 }
        );
    }

    const [existingMeeting] = await db
        .select()
        .from(meetings)
        .where(
            and(
                eq(meetings.id, meetingId),
                not(eq(meetings.status, "completed")),
                not(eq(meetings.status, "active")),
                not(eq(meetings.status, "cancelled")),
                not(eq(meetings.status, "processing"))
            )
        )

        if (!existingMeeting) {
            return NextResponse.json(
                { error: "Meeting not found" },
                { status: 400 }
            );
        }

        await db
            .update(meetings)
            .set({ 
                status: "active",
                startedAt: new Date(),
            })
            .where(eq(meetings.id, existingMeeting.id))


        const [existingAgent] = await db
            .select()
            .from(agents)
            .where(eq(agents.id, existingMeeting.agentId))
            
        if (!existingAgent) {
            return NextResponse.json({ error: "Agent not found" }, { status: 400 })
        }

        const call = streamVideo.video.call("default", meetingId)

        const openAiApiKey = process.env.OPENAI_API_KEY;
        if (!openAiApiKey) {
            return NextResponse.json(
                { error: "Missing OpenAI API key" },
                { status: 500 }
            );
        }

        // Ensure the agent exists as a user in Stream
        await streamVideo.upsertUsers([
            {
                id: existingAgent.id,
                name: existingAgent.name,
                role: "user",
            }
        ]);

        const realtimeClient = await streamVideo.video.connectOpenAi({
            call,
            openAiApiKey,
            agentUserId: existingAgent.id,
        })

        realtimeClient.updateSession({
            instructions: existingAgent.instructions,
        })

        // The agent will be automatically joined via the OpenAI connection
        // No need to manually join as the connectOpenAi method handles this
    } else if (eventType === "call.session_participant_left") {
        const event = payload as CallSessionParticipantLeftEvent;
        const meetingId = event.call_cid.split(":")[1]

        if (!meetingId) {
            return NextResponse.json(
                { error: "Missing meeting id" },
                { status: 400 }
            );
        }
        
        const call = streamVideo.video.call("default", meetingId)
        await call.end()
    } else if (eventType === "call.session_ended") {
        const event = payload as CallSessionEndedEvent;
        const meetingId = event.call.custom?.meetingId

        if (!meetingId) {
            return NextResponse.json(
                { error: "Missing meeting id" },
                { status: 400 }
            );
        }

        await db
            .update(meetings)
            .set({ 
                status: "processing",
                endedAt: new Date(),
            })
            .where(and(eq(meetings.id, meetingId), eq(meetings.status, "active")))
    } else if (eventType === "call.transcription_ready") {
        const event = payload as CallTranscriptionReadyEvent;
        const meetingId = event.call_cid.split(":")[1]
        
        const [updatedMeeting] = await db
            .update(meetings)
            .set({ 
                transcriptUrl: event.call_transcription.url,
            })
            .where(eq(meetings.id, meetingId))
            .returning()

        if (!updatedMeeting) {
            return NextResponse.json(
                { error: "Meeting not found" },
                { status: 400 }
            );
        }
        
        await inngest.send({
            name: "meetings/processing",
            data: {
                meetingId: meetingId,
                transcriptUrl: updatedMeeting.transcriptUrl,
            },
        })
        
    } else if (eventType === "call.recording_ready") {
        const event = payload as CallRecordingReadyEvent;
        const meetingId = event.call_cid.split(":")[1]
        
        await db
            .update(meetings)
            .set({ 
                recordingUrl: event.call_recording.url,
            })
            .where(eq(meetings.id, meetingId))
            .returning()

    }

    return NextResponse.json({ status: "ok" })
}
