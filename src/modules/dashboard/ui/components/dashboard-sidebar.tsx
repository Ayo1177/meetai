"use client"

import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar'
import { BotIcon, StarIcon, VideoIcon, XIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import { DashboardUserButton } from './dashboard-user-button'

import { DashboardTrial } from './dashboard-trial'




const firstSection = [
    {
        icon: VideoIcon,
        label: 'Meetings',
        href: '/meetings', // Add leading slash to match pathname
    },
    {
        icon: BotIcon,
        label: 'Agents',
        href: '/agents', // Add leading slash
    },
]

const SecondSection = [
    {
        icon: StarIcon,
        label: 'Upgrade',
        href: '/upgrade',
    }  
]

export const DashboardSidebar = () => {
    const pathname = usePathname()
    const { toggleSidebar } = useSidebar()

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="text-sidebar-accent-foreground relative">
                <Link href="/" className="flex items-center gap-2 px-2 pt-2">
                    <Image src="/logo.svg" width={36} height={36} alt="Meet.AI" />
                    <p className='text-2xl font-semibold'>Meet.AI</p>
                </Link>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleSidebar}
                    className="absolute top-2 right-2 h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                    <XIcon className="h-4 w-4" />
                    <span className="sr-only">Close sidebar</span>
                </Button>
            </SidebarHeader>
            <div className='px-4 py-2'>
                <hr className="opacity-10 text-[#5D6B68]" />
            </div>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {firstSection.map((item) => (
                                <SidebarMenuItem key={item.href}>
                                    <SidebarMenuButton 
                                        asChild
                                        className={cn(
                                            "h-10 hover:bg-gradient-to-r border border-transparent hover:border-[#5D6B68]/10 from-sidebar-accent from-5% via-sidebar/50 to-sidebar/50",
                                            pathname === item.href && "bg-gradient-to-r border-[#5D6B68]/10"
                                        )}
                                        isActive={pathname === item.href}
                                    >
                                        <Link href={item.href} className="flex items-center gap-2 w-full">
                                            <item.icon className="w-4 h-4 mr-2" />
                                            <span className='text-sm font-medium tracking-tight'>
                                                {item.label}
                                            </span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <div className='px-4 py-2'>
                    <hr className="opacity-10 text-[#5D6B68]" />
                </div>



                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {SecondSection.map((item) => (
                                <SidebarMenuItem key={item.href}>
                                    <SidebarMenuButton 
                                        asChild
                                        className={cn(
                                            "h-10 hover:bg-gradient-to-r border border-transparent hover:border-[#5D6B68]/10 from-sidebar-accent from-5% via-sidebar/50 to-sidebar/50",
                                            pathname === item.href && "bg-gradient-to-r border-[#5D6B68]/10"
                                        )}
                                        isActive={pathname === item.href}
                                    >
                                        <Link href={item.href} className="flex items-center gap-2 w-full">
                                            <item.icon className="w-4 h-4 mr-2" />
                                            <span className='text-sm font-medium tracking-tight'>
                                                {item.label}
                                            </span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className='text-white'>
                <DashboardTrial />
                <DashboardUserButton />
            </SidebarFooter>
        </Sidebar>
    )
}