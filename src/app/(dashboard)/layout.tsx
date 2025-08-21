import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { DashboardSidebar } from '@/modules/dashboard/ui/components/dashboard-sidebar'
import React from 'react'
interface Props {
    children: React.ReactNode
};




const layout = ({ children }: Props) => (
  <SidebarProvider>
    <DashboardSidebar />
    <SidebarInset>{children}</SidebarInset>
  </SidebarProvider>
)

export default layout
