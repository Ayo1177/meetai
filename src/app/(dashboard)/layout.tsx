import React from 'react'
import { DashboardClientWrapper } from '@/components/dashboard-client-wrapper'

// Force dynamic rendering for this layout
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface Props {
    children: React.ReactNode
};

const layout = ({children}: Props) => {
  return (
    <DashboardClientWrapper>
      {children}
    </DashboardClientWrapper>
  )
}   

export default layout
