import { MeetingsView } from '@/modules/meetings/server/ui/views/meetings-view'
import { getQueryClient, trpc } from '@/trpc/server';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import React, { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary';

const page = () => {


    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(
        trpc.meetings.getMany.queryOptions({}));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense >
      <ErrorBoundary>
        <MeetingsView />
      </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  )
}

export default page