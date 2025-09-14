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
} from "@stream-io/video-react-sdk";
import { NextRequest, NextResponse } from "next/server";
import { streamVideo } from "@/lib/stream-video";

function verifySignatureWithSDK(body: string, signature: string): boolean {
    // Use the correct streamVideo instance, not the React component
    return streamVideo.verifyWebhook(body, signature);
}

export async function POST(req: NextRequest) {
    console.log("🔔 Webhook received");
    
    const signature = req.headers.get("x-signature")
    const apiKey = req.headers.get("x-api-key")

    if (!signature || !apiKey) {
        console.log("❌ Missing signature or api key");
        return NextResponse.json(
            { error: "Missing signature or api key" },
            { status: 400 }
        );
    }

    const body = await req.text();
    console.log("📝 Webhook body:", body);

    if (!verifySignatureWithSDK(body, signature)) {
        console.log("❌ Invalid signature");
        return NextResponse.json(
            { error: "Invalid signature" },
            { status: 400 }
        );
    }
    
    let payload: unknown;
    try {
        payload = JSON.parse(body) as Record<string, unknown>
    } catch (error) {
        console.log("❌ Invalid JSON:", error);
        return NextResponse.json(
            { error: "Invalid JSON" },
            { status: 400 }
        );
    }

    const eventType = (payload as Record<string, unknown>)?.type
    console.log("🎯 Event type:", eventType);

    if (eventType === "call.session_started") {
        console.log("🚀 Call session started event received");
        const event = payload as CallSessionStartedEvent
        const meetingId = event.call.custom?.meetingId
        console.log("📞 Meeting ID:", meetingId);

    if (!meetingId) {
        console.log("❌ Missing meeting id");
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
        console.log("👤 Upserting agent as Stream user:", existingAgent.id);
        await streamVideo.upsertUsers([
            {
                id: existingAgent.id,
                name: existingAgent.name,
                role: "user",
            }
        ]);

        console.log("🤖 Connecting OpenAI client for agent:", existingAgent.id);
        const realtimeClient = await streamVideo.video.connectOpenAi({
            call,
            openAiApiKey,
            agentUserId: existingAgent.id,
        })

        console.log("📋 Updating session with instructions");
        realtimeClient.updateSession({
            instructions: existingAgent.instructions,
        })

        console.log("✅ Agent setup completed - agent should join the call");
        // The agent will be automatically joined via the OpenAI connection
        // No need to manually join as the connectOpenAi method handles this
    } else if (eventType === "call.session_participant_left") {
        console.log("👋 Call session participant left event received");
        const event = payload as CallSessionParticipantLeftEvent;
        const meetingId = event.call_cid.split(":")[1]

        if (!meetingId) {
            console.log("❌ Missing meeting id in participant left event");
            return NextResponse.json(
                { error: "Missing meeting id" },
                { status: 400 }
            );
        }
        
        console.log("📞 Ending call for meeting:", meetingId);
        const call = streamVideo.video.call("default", meetingId)
        await call.end()
    } else {
        console.log("ℹ️ Unhandled event type:", eventType);
    }

    console.log("✅ Webhook processed successfully");
    return NextResponse.json({ status: "ok" })
}
