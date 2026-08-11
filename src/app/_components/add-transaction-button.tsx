"use client";
import { useState } from "react";
import Image from "next/image";
import PlusIcon from "@/src/assets/recent-transactions/plus-icon.png";
import ConfirmIcon from "@/src/assets/recent-transactions/confirm-icon.png";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/src/app/_components/ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";

import { useForm, Controller, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    TRANSACTION_CATEGORY_OPTIONS,
    TRANSACTION_PAYMENT_METHOD_OPTIONS,
    TRANSACTION_TYPE_OPTIONS,
} from "../_constants/transaction";

import {
    createTransactionFormSchema,
    type CreateTransactionFormData,
} from "../_schemas/transaction";
import { addTransaction } from "../_actions/add-transaction";
import { useRouter } from "next/navigation";

export const AddTransactionButton = () => {
    const [open, setIsOpen] = useState<boolean>(false);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors, isSubmitting },
    } = useForm<CreateTransactionFormData>({
        resolver: zodResolver(
            createTransactionFormSchema,
        ) as unknown as Resolver<CreateTransactionFormData>,
        defaultValues: {
            name: "",
            amount: undefined,
            type: undefined,
            category: undefined,
            paymentMethod: undefined,
            date: undefined,
        },
        mode: "onBlur",
    });

    const onSubmit = async (data: CreateTransactionFormData) => {
        try {
            await addTransaction(data);
            reset();
            setIsOpen(false);
            router.refresh();
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <section>
            <Dialog open={open} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <button
                        type="button"
                        className="rounded-sm bg-[#9333EA] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition-colors flex items-center gap-2 cursor-pointer"
                    >
                        <Image src={PlusIcon} alt="Plus Icon" />
                        <p>Adicionar</p>
                    </button>
                </DialogTrigger>
                <DialogContent className="bg-[#1E293B] text-white">
                    <DialogHeader className="p-2 ">
                        <DialogTitle>Nova transação</DialogTitle>
                    </DialogHeader>
                    <div className="-mx-[15px] border-b border-[#293345]"></div>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col gap-4 pt-4"
                    >
                        <div className="space-y-2">
                            <Label>Titulo</Label>
                            <Input
                                className="bg-[#293445]"
                                id="name"
                                placeholder="Ex: Almoço, Freela..."
                                {...register("name")}
                            />
                            {errors.name && (
                                <p className="text-xs text-red-500">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label>Valor (R$)</Label>
                            <Input
                                className="rounded-xl py-4 bg-[#293445]"
                                id="amount"
                                type="number"
                                placeholder="0,00"
                                {...register("amount")}
                            />
                            {errors.amount && (
                                <p className="text-xs text-red-500">
                                    {errors.amount.message}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label>Tipo</label>
                            <Controller
                                control={control}
                                name="type"
                                render={({ field }) => (
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <SelectTrigger className="w-full bg-[#293445]">
                                            <SelectValue placeholder="Selecione o tipo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {TRANSACTION_TYPE_OPTIONS.map(
                                                (opt) => (
                                                    <SelectItem
                                                        key={opt.value}
                                                        value={opt.value}
                                                    >
                                                        {opt.label}
                                                    </SelectItem>
                                                ),
                                            )}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.type && (
                                <p className="text-xs text-red-500">
                                    {errors.type.message}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label>Categoria</label>
                            <Controller
                                control={control}
                                name="category"
                                render={({ field }) => (
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <SelectTrigger className="w-full bg-[#293445]">
                                            <SelectValue placeholder="Selecione a categoria" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {TRANSACTION_CATEGORY_OPTIONS.map(
                                                (opt) => (
                                                    <SelectItem
                                                        key={opt.value}
                                                        value={opt.value}
                                                    >
                                                        {opt.label}
                                                    </SelectItem>
                                                ),
                                            )}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.category && (
                                <p className="text-xs text-red-500">
                                    {errors.category.message}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label>Método de pagamento</label>
                            <Controller
                                control={control}
                                name="paymentMethod"
                                render={({ field }) => (
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <SelectTrigger className="w-full bg-[#293445]   ">
                                            <SelectValue placeholder="Selecione o método de pagamento" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {TRANSACTION_PAYMENT_METHOD_OPTIONS.map(
                                                (opt) => (
                                                    <SelectItem
                                                        key={opt.value}
                                                        value={opt.value}
                                                    >
                                                        {opt.label}
                                                    </SelectItem>
                                                ),
                                            )}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.paymentMethod && (
                                <p className="text-xs text-red-500">
                                    {errors.paymentMethod.message}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label>Data</Label>
                            <Input
                                type="date"
                                className="bg-[#293445]"
                                id="date"
                                placeholder="__/__/_____"
                                {...register("date")}
                            />
                            {errors.date && (
                                <p className="text-xs text-red-500">
                                    {errors.date.message}
                                </p>
                            )}
                        </div>
                        <DialogFooter className="gap-4 border-none bg-[#1E293B] flex flex-row">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsOpen(false);
                                    reset();
                                }}
                                className="border border-[#CAD5E2] rounded-lg w-1/3 py-2.5 cursor-pointer"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-[#8E51FF] w-2/3 flex items-center justify-center gap-2 rounded-xl cursor-pointer"
                            >
                                <Image
                                    src={ConfirmIcon}
                                    alt="icone de confirmação"
                                />
                                <p className="font-semibold text-sm">
                                    {isSubmitting
                                        ? "Salvando..."
                                        : "Salvar transação"}
                                </p>
                            </button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </section>
    );
};
