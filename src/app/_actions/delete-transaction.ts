'use server'
import { prisma } from "@/src/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/src/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function deleteTransaction(transactionID: string){
        const session = await auth.api.getSession({
            headers: await headers()
        })
    
        const userID = session?.user.id
        if (!userID) {
            redirect("/sign-in")
        }
    try {
        const result = await prisma.transaction.deleteMany({
            where:{
                id: transactionID,
                userID: userID
            }
        })

        if (result.count === 0) {
            throw new Error("Transação não encontrada ou você não tem permissão para deletá-la.")
        }

        revalidatePath("/transactions")


    } catch (error) {
        console.error("Erro ao deletar transação", error)
        throw error
    }
}

