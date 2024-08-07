'use server';

import {z} from 'zod';
import {createRouteHandlerClient} from "@supabase/auth-helpers-nextjs";
import {FormSchema} from "@/lib/types";
import {cookies} from "next/headers";

export async function actionLoginUser({
                                          email,
                                          password
                                      }: z.infer<typeof FormSchema>) {
    const supabase = createRouteHandlerClient({cookies});
    return await supabase.auth.signInWithPassword({
        email,
        password,
    });
}

export async function actionSignUpUser({
                                           email,
                                           password
                                       }: z.infer<typeof FormSchema>) {
    const supabase = createRouteHandlerClient({cookies});
    const {data} = await supabase
        .from("profiles")
        .select("*")
        .eq("email", email);

    if (data?.length) {
        return {error: {message: "User already exists", data}};
    }

    return await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback`
        },
    });
}