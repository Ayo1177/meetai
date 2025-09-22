import { ErrorBoundaryWrapper } from '@/components/error-boundary-wrapper'
import { authClient } from '@/lib/auth-client'
import { 
  MeetingIdView, 
  MeetingIdViewLoading, 
  MeetingIdViewError } from '@/modules/meetings/server/ui/views/meeting-id-view'
import { getQueryClient, trpc } from '@/trpc/server'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface Props {
  params: Promise<{ 
    meetingId: string 
  }>
}


const page = async ({ params }: Props) => {
  const { meetingId } = await params

  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  })

  if (!session) {
    redirect("/auth/sign-in")
  }

  const queryClient = getQueryClient()
  void queryClient.prefetchQuery(
    trpc.meetings.getOne.queryOptions({ id: meetingId })
  )

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<MeetingIdViewLoading />}>
        <ErrorBoundaryWrapper fallback={<MeetingIdViewError />}>
          <MeetingIdView meetingId={meetingId} />
        </ErrorBoundaryWrapper>
      </Suspense>
    </HydrationBoundary>
  )
}

export default page