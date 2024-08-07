import {z} from 'zod';

export const FormSchema = z.object({
    email: z.string().describe("Email").email({message: "Invalid email address"}),
    password: z.string().describe("Password").min(1, "Password is required"),
});

export const CreateWorkspaceFormSchema = z.object({
    workspaceName: z
        .string()
        .describe("Workspace Name")
        .min(1, "Workspace name must be at least 1 characters"),
    logo: z.any(),
});