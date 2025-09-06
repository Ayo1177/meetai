import { MeetingsView } from '@/modules/meetings/server/ui/views/meetings-view'
import { getQueryClient, trpc } from '@/trpc/server';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { Suspense } from 'react';
import { ErrorBoundaryWrapper } from '@/components/error-boundary-wrapper';
import { MeetingsListHeader } from '@/modules/meetings/server/ui/meetings-list-header';
import { authClient } from '@/lib/auth-client';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

const page = async () => {
    const { data: session } = await authClient.getSession({
        fetchOptions: {
          headers: await headers(),
        },
      });
    
      if (!session) {
        redirect("/auth/sign-in");
      }


    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(
        trpc.meetings.getMany.queryOptions({}));

  return (
    <>
    <MeetingsListHeader />
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense>
                <ErrorBoundaryWrapper fallback={<div>Something went wrong loading meetings</div>}>
                    <MeetingsView />
                </ErrorBoundaryWrapper>
            </Suspense>
        </HydrationBoundary>
    </>
  )
}

export default page