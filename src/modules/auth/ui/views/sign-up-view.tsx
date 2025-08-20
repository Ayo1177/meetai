"use client"

import React, { use } from 'react'
import { z } from 'zod'
import { zodResolver} from "@hookform/resolvers/zod"
import { FaGithub, FaGoogle } from "react-icons/fa"
// to seperate the npm import and local import
import { Input } from '@/components/ui/input'

import {Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertTitle} from '@/components/ui/alert'
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useForm } from "react-hook-form";
import { useState } from 'react';
import { OctagonAlert, OctagonAlertIcon } from 'lucide-react'

import Link from 'next/link';
import { useRouter } from 'next/navigation'

const formSchema = z.object({
    name: z.string().min(1, { message: 'Name is Required' }),
    email: z.string().email(),
    password: z.string().min(1, { message: 'Password is Required' }),
    confirmPassword: z.string().min(1, { message: 'Confirm Password is Required' }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
})

export const SignUpView = () => {

    const router = useRouter()
    const [error, setError] = useState<string | null>(null)
    const [pending, setPending] = useState(false)



    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    })

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setError(null)
        
        authClient.signUp.email({
            
            name: data.name,
            email: data.email,
            password: data.password,
            callbackURL: "/"
        },
        {
            onSuccess: () => {
                setPending(false)
                router.push("/")
                
            },
            onError: ( {error} ) => {
                setError(error.message)
            }
        }
        );
        
    }


    const onSocial = (provider: "github" | "google") => {
            setError(null)
            setPending(true)
            
    
            authClient.signIn.social(
                { 
                    provider : provider,
                    callbackURL: "/"
                },
            {
                onSuccess: () => {
                    setPending(false)
                    
                },
                onError: ( {error} ) => {
                    setError(error.message)
                }
            }
            );
            
        }


  return (
    <div className='flex flex-col gap-6'>
        <Card className='overflow-hidden p-0'>
            <CardContent className='grid p-0 md:grid-cols-2'>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='p-6 md:p-8'>
                        <div className='flex flex-col gap-6'>
                            <div className='flex flex-col items-center text-center'>
                                <h1 className='text-2xl font-bold'>
                                    let&apos;s get you started
                                </h1>
                                <p className='text-muted-foreground text-balance'>
                                    Create your Account 
                                </p>
                            </div>
                            <div className='grid gap-3'>
                                <FormField
                                    control={form.control}
                                    name='name'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type='text'
                                                    placeholder='ayo b'
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />  
                                <FormField
                                    control={form.control}
                                    name='email'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <input
                                                    type='email'
                                                    placeholder='n@example.com'
                                                    {...field}
                                                    className='input'
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='password'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <input
                                                    type='password'
                                                    placeholder='*********'
                                                    {...field}
                                                    className='input'
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='confirmPassword'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Confirm Password</FormLabel>
                                            <FormControl>
                                                <input
                                                    type='password'
                                                    placeholder='*********'
                                                    {...field}
                                                    className='input'
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />


                            </div>
                            {!!error && (
                                <Alert className='bg-destructive/10 border-none'>
                                <OctagonAlertIcon className='h-5 w-5 text-destructive' />
                                    <AlertTitle>{error}</AlertTitle>
                                
                                </Alert>)}
                            <Button disabled={pending} className='w-full' type='submit'>Sign Up</Button>
                            <div className='after:border-border relatice text-center text-sm after:absolute after:insert-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t'>
                                <span className='bg-card text-muted-foreground relative z-10 px-2'>
                                    Or Continue with
                                </span>
                            </div>
                            <div className='grid grid-cols-2 gap-4'>
                                <Button 
                                onClick={() => onSocial( 'google')}
                                variant='outline' 
                                type="button" 
                                className='w-full'>
                                    
                                    <FaGoogle />
                                </Button>
                                <Button 
                                onClick={() => onSocial( 'github')}
                                variant='outline' 
                                type='button' 
                                className='w-full'>
                                    
                                    <FaGithub />
                                </Button>

                            </div>
                            <div className='text-center'>
                                Already have an account? <Link href='/auth/sign-in' className='underline underline-offset-4'>Sign In</Link>
                            </div>

                        </div>
                    </form>
                </Form>



                <div className='bg-radial from-green-500 to-green-900 relative hidden md:flex flex-col gap-y-4 items-center justify-center'>
                    <img src="/Logo.svg" alt="Image" className='h-[92px] w-[92px]' />
                    <p className='text-xl font-semibold text-white'>
                       Meet.ai 
                    </p>
                </div>
            </CardContent>
        </Card>
        <div className='text-muted-foreground *[a]:hover:text-primary text-center text-xs text-balance *[a]:underline *[a]:underline-offset-4'>
            By Clicking continue, you agree to our <a href='#'>Terms of Service </a> and <a href='#'>Privacy Policy</a>
        </div>
    </div>

    )
}
