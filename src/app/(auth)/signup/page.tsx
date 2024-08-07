'use client';
import React, {useMemo, useState} from 'react';
import {z} from 'zod';
import {useRouter, useSearchParams} from "next/navigation";
import {clsx} from "clsx";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormDescription, FormField, FormItem, FormMessage} from "@/components/ui/Form";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../../../public/cypress-logo.svg";
import {Input} from "@/components/ui/Input";
import {Button} from "@/components/ui/Button";
import Loader from "@/components/Loader";
import {FormSchema} from "@/lib/types";
import {actionSignUpUser} from "@/lib/server-actions/auth-actions";
import {MailCheck} from "lucide-react";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/Alert";

const SignUpFormSchema = z.object({
    email: z
        .string()
        .describe("Email")
        .email("Invalid email address"),
    password: z
        .string()
        .describe("Password")
        .min(6, "Password must be at least 6 characters"),
    confirmPassword: z
        .string()
        .describe("Confirm Password")
        .min(6, "Confirm Password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ['confirmPassword']
});

const Signup = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [submitError, setSubmitError] = useState("");
    const [confirmation, setConfirmation] = useState(false);

    const codeExchangeError = useMemo(() => {
        if (!searchParams) return "";
        return searchParams.get("error_description");
    }, [searchParams]);

    const confirmationAndErrorStyles = useMemo(() => clsx("bg-primary", {
        "bg-red-500/10": codeExchangeError,
        "border-red-500/50": codeExchangeError,
        "text-red-700": codeExchangeError,
    }), []);

    const form = useForm<z.infer<typeof SignUpFormSchema>>({
        mode: "onChange",
        resolver: zodResolver(SignUpFormSchema),
        defaultValues: {email: "", password: "", confirmPassword: ""}
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async ({email, password}: z.infer<typeof FormSchema>) => {
        const {error} = await actionSignUpUser({email, password});
        if (error) {
            setSubmitError(error.message);
            form.reset();
            return;
        }
        setConfirmation(true);
    };
    
    return (
        <Form {...form}>
            <form
                onChange={() => {
                    if (submitError) {
                        setSubmitError("");
                    }
                }}
                onSubmit={form.handleSubmit(onSubmit)}
                className="
                w-full
                sm:justify-center
                sm:w-[400px]
                space-y-6
                flex
                flex-col"
            >
                <Link
                    href={"/"}
                    className="
                    w-full
                    flex
                    justify-left
                    items-center"
                >
                    <Image
                        src={Logo}
                        alt="Cypress Logo"
                        width={50}
                        height={50}
                    />
                    <span className="
                    font-semibold
                    dark:text-white
                    text-4xl
                    first-letter:ml-2">
                        cypress.
                    </span>
                </Link>
                <FormDescription
                    className="text-foreground/60"
                >
                    An all-In-One Collaboration and Productivity Platform
                </FormDescription>
                {!confirmation && !codeExchangeError && (
                    <>
                        <FormField
                            disabled={isLoading}
                            control={form.control}
                            name="email"
                            render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="Enter your email"
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        >
                        </FormField>
                        <FormField
                            disabled={isLoading}
                            control={form.control}
                            name="password"
                            render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Enter your password"
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        >
                        </FormField>
                        <FormField
                            disabled={isLoading}
                            control={form.control}
                            name="confirmPassword"
                            render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Enter confirm password"
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        >
                        </FormField>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full p-6"
                        >
                            {!isLoading ? "Create Account" : <Loader/>}
                        </Button>
                    </>
                )}
                {submitError && <FormMessage>{submitError}</FormMessage>}
                <span className="self-container">
                    Already have an account?{' '}
                    <Link
                        href={"/login"}
                        className="text-primary"
                    >
                        Login
                    </Link>
                </span>
                {(confirmation || codeExchangeError) && (
                    <>
                        <Alert
                            className={confirmationAndErrorStyles}>
                            {!codeExchangeError && (<MailCheck className="w-4 h-4"/>)}
                            <AlertTitle>
                                {' '}
                                {codeExchangeError ? "Invalid Link" : "Check your email."}
                            </AlertTitle>
                            <AlertDescription>
                                {codeExchangeError || "An email has been sent."}
                            </AlertDescription>
                        </Alert>
                    </>
                )}
            </form>
        </Form>
    );
};

export default Signup;