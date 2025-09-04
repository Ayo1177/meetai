"use client"

import { ErrorBoundary } from "react-error-boundary"
import { ReactNode } from "react"

interface ErrorBoundaryWrapperProps {
    children: ReactNode
    fallback?: ReactNode
}

export const ErrorBoundaryWrapper = ({ children, fallback }: ErrorBoundaryWrapperProps) => {
    return (
        <ErrorBoundary fallbackRender={() => fallback ? fallback : <p>Error</p>}>
            {children}
        </ErrorBoundary>
    )
}
