import Image from "next/image";
import { Inter } from "next/font/google";

import Sidebar from "@/src/app/_components/sidebar";
import Header from "@/src/app/_components/header";
import deleteIcon from "@/src/assets/transactions/dump-icon.png";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/src/app/_components/ui/table";
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { TransactionType } from "@prisma/client";
import { deleteTransaction } from "../_actions/delete-transaction";
import {
    TRANSACTION_TYPE_LABELS,
    TRANSACTION_CATEGORY_LABELS,
    TRANSACTION_PAYMENT_METHOD_LABELS,
} from "../_constants/transaction";

const inter = Inter({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

const TYPE_BADGE_STYLES: Record<TransactionType, string> = {
    DEPOSIT: "bg-[#00BC7D]/20 text-[#00D492]",
    EXPENSE: "bg-[#FB2C36]/20 text-[#FF6467]",
    INVESTMENT: "bg-[#2B7FFF]/20 text-[#51A2FF]",
};

const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });

const formatDate = (date: Date) =>
    date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });

export default async function TransactionsPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    const userID = session?.user.id;

    if (!userID) {
        redirect("/sign-in");
    }

    const transactions = await prisma.transaction.findMany({
        where: {
            userID,
        },
        orderBy: {
            date: "desc",
        },
    });

    return (
        <div className="flex min-h-screen bg-[#0F111A]">
            <Sidebar />

            <div className={`flex flex-1 flex-col ${inter.className}`}>
                <Header userName={session.user.name} />

                <main className="p-4 md:p-8">
                    <section className="space-y-1">
                        <h1 className="text-[30px] font-bold leading-[1.2] tracking-[-0.025em] text-white">
                            Transacoes
                        </h1>
                        <p className="text-sm text-[#90A1B9]">
                            Gerencie suas entradas, despesas e investimentos
                        </p>
                    </section>

                    <section className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-[rgba(30,41,59,0.8)] shadow-[0px_8px_10px_-6px_rgba(0,0,0,0.2),0px_20px_25px_-5px_rgba(0,0,0,0.2)]">
                        <Table className="hidden lg:table w-full">
                            <TableHeader className="bg-white/6">
                                <TableRow className="border-b border-white/10 hover:bg-transparent">
                                    <TableHead className="h-auto px-4 py-4 text-xs font-semibold uppercase tracking-[0.05em] text-[#CAD5E2]">
                                        Nome
                                    </TableHead>
                                    <TableHead className="h-auto px-4 py-4 text-xs font-semibold uppercase tracking-[0.05em] text-[#94A3B8]">
                                        Categoria
                                    </TableHead>
                                    <TableHead className="h-auto px-4 py-4 text-xs font-semibold uppercase tracking-[0.05em] text-[#94A3B8]">
                                        Metodo
                                    </TableHead>
                                    <TableHead className="h-auto px-4 py-4 text-xs font-semibold uppercase tracking-[0.05em] text-[#94A3B8]">
                                        Tipo
                                    </TableHead>
                                    <TableHead className="h-auto px-4 py-4 text-xs font-semibold uppercase tracking-[0.05em] text-[#94A3B8]">
                                        Data
                                    </TableHead>
                                    <TableHead className="h-auto px-4 py-4 text-right text-xs font-semibold uppercase tracking-[0.05em] text-[#94A3B8]">
                                        Valor
                                    </TableHead>
                                    <TableHead className="h-auto px-4 py-4 text-right text-xs font-semibold uppercase tracking-[0.05em] text-[#94A3B8]">
                                        Acoes
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transactions.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={7}
                                            className="text-center py-10 text-[#94A3B8]"
                                        >
                                            Nenhuma transação encontrada
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    transactions.map((transaction) => (
                                        <TableRow
                                            key={transaction.id}
                                            className="border-b border-white/5 hover:bg-transparent"
                                        >
                                            <TableCell className="px-4 py-5 text-sm font-medium text-white">
                                                {transaction.name}
                                            </TableCell>
                                            <TableCell className="px-4 py-5 text-sm text-[#CAD5E2]">
                                                {
                                                    TRANSACTION_CATEGORY_LABELS[
                                                        transaction.category
                                                    ]
                                                }
                                            </TableCell>
                                            <TableCell className="px-4 py-5 text-sm text-[#90A1B9]">
                                                {
                                                    TRANSACTION_PAYMENT_METHOD_LABELS[
                                                        transaction
                                                            .paymentMethod
                                                    ]
                                                }
                                            </TableCell>
                                            <TableCell className="px-4 py-5">
                                                <span
                                                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${TYPE_BADGE_STYLES[transaction.type]}`}
                                                >
                                                    {
                                                        TRANSACTION_TYPE_LABELS[
                                                            transaction.type
                                                        ]
                                                    }
                                                </span>
                                            </TableCell>
                                            <TableCell className="px-4 py-5 text-sm text-[#90A1B9]">
                                                {formatDate(transaction.date)}
                                            </TableCell>
                                            <TableCell
                                                className={`px-4 py-5 text-right text-sm font-semibold ${
                                                    transaction.type ===
                                                    "EXPENSE"
                                                        ? "text-[#FF6467]"
                                                        : "text-[#00D492]"
                                                }`}
                                            >
                                                {formatCurrency(
                                                    Number(transaction.amount),
                                                )}
                                            </TableCell>
                                            <TableCell className="px-4 py-5">
                                                <div className="flex justify-end mr-3">
                                                    <form
                                                        action={deleteTransaction.bind(
                                                            null,
                                                            transaction.id,
                                                        )}
                                                    >
                                                        <button
                                                            type="submit"
                                                            className="hover:opacity-80 transition-opacity"
                                                        >
                                                            <Image
                                                                src={deleteIcon}
                                                                alt="Deletar transação"
                                                                className="cursor-pointer"
                                                            />
                                                        </button>
                                                    </form>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                        <div className="lg:hidden flex flex-col gap-3 p-4">
                            {transactions.length === 0 ? (
                                <p className="text-center text-[#94A3B8]">
                                    Nenhuma transação encontrada
                                </p>
                            ) : (
                                transactions.map((transaction) => (
                                    <div
                                        key={transaction.id}
                                        className="bg-[#161B26] p-4 rounded-xl border border-white/10"
                                    >
                                        <div className="flex justify-between items-center">
                                            <span className="font-semibold text-white">
                                                {transaction.name}
                                            </span>

                                            <span
                                                className={`text-sm font-semibold ${
                                                    transaction.type ===
                                                    "EXPENSE"
                                                        ? "text-[#FF6467]"
                                                        : "text-[#00D492]"
                                                }`}
                                            >
                                                {formatCurrency(
                                                    Number(transaction.amount),
                                                )}
                                            </span>
                                        </div>

                                        <div className="mt-2 text-sm text-[#90A1B9]">
                                            {
                                                TRANSACTION_CATEGORY_LABELS[
                                                    transaction.category
                                                ]
                                            }{" "}
                                            •{" "}
                                            {
                                                TRANSACTION_PAYMENT_METHOD_LABELS[
                                                    transaction.paymentMethod
                                                ]
                                            }
                                        </div>

                                        <div className="flex justify-between items-center mt-3">
                                            <span className="text-xs text-[#90A1B9]">
                                                {formatDate(transaction.date)}
                                            </span>

                                            <span
                                                className={`text-xs px-2 py-1 rounded-full ${
                                                    TYPE_BADGE_STYLES[
                                                        transaction.type
                                                    ]
                                                }`}
                                            >
                                                {
                                                    TRANSACTION_TYPE_LABELS[
                                                        transaction.type
                                                    ]
                                                }
                                            </span>
                                        </div>
                                        <div className="flex justify-end mt-3">
                                            <form
                                                action={deleteTransaction.bind(
                                                    null,
                                                    transaction.id,
                                                )}
                                            >
                                                <button
                                                    type="submit"
                                                    className="hover:opacity-80 transition-opacity"
                                                >
                                                    <Image
                                                        src={deleteIcon}
                                                        alt="Deletar transação"
                                                        className="cursor-pointer"
                                                    />
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}
