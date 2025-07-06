"use client"
import { ThemeProvider } from 'next-themes'
import React, { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'sonner'
import NextTopLoader from 'nextjs-toploader'
export function AppProviders({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient())
    return (
        <QueryClientProvider client={queryClient}>
            <NextTopLoader color="#4f46e5" showSpinner={false} />
            <ThemeProvider
                attribute="class" defaultTheme='system' enableSystem={true}>
                {children}
                 <Toaster />
            </ThemeProvider>
            {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        </QueryClientProvider>
    )
   
}