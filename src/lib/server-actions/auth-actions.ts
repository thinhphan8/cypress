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