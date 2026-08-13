"use client";
import { AuthLayout } from "../_components/auth-layout";
import ArrowIcon from "../../../assets/auth/arrow-icon.png";
import Image from "next/image";
import { inputClass } from "../_styles/input";
import { Eye, EyeOff } from "lucide-react";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/src/lib/auth-client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const signUpFormSchema = z.object({
    name: z.string().trim().nonempty("O nome é obrigatório."),
    email: z
        .string()
        .min(1, "O email é obrigatório.")
        .regex(z.regexes.email, "Informe um email válido."),
    password: z
        .string()
        .min(8, "A senha deve ter no mínimo 8 caracteres.")
        .regex(
            /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).+$/,
            "A senha deve conter letra, número e símbolo.",
        )
        .refine((val) => {
            const half = val.slice(0, val.length / 2);
            return !(val.length % 2 === 0 && half.repeat(2) === val);
        }, "Senha não pode ser um padrão repetido."),
});

type SignUpFormData = z.input<typeof signUpFormSchema>;

export default function SingUpPage() {
    const [apiError, setApiError] = useState<string>("");
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const {
        register,
        reset,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignUpFormData>({
        resolver: zodResolver(signUpFormSchema),
        defaultValues: {
            name: "",
            email: undefined,
            password: undefined,
        },
        mode: "onBlur",
    });

    const onSubmit = async (data: SignUpFormData) => {
        try {
            const { data: result, error: err } = await authClient.signUp.email({
                name: data.name,
                email: data.email,
                password: data.password,
                callbackURL: "/",
            });

            if (err) {
                setApiError(
                    err.message ?? "Erro ao criar conta. Tente outro email.",
                );
                return;
            }

            if (result) router.push("/");
            reset();
        } catch (error) {
            setApiError(
                error instanceof Error
                    ? error.message
                    : "Erro inesperado. Tente novamente",
            );
        }
    };

    return (
        <AuthLayout
            title="Criar conta"
            description="Preencha os dados para começar"
            footerText="Já tem uma conta?"
            footerLinkText="Entrar"
            footerHref="/sign-in"
        >
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <label className="block text-sm text-zinc-300 mb-2">Nome</label>
                <input
                    type="text"
                    placeholder="Seu nome"
                    className={inputClass}
                    {...register("name")}
                />

                {errors.name && (
                    <p className="text-xs text-red-500">
                        {errors.name.message}
                    </p>
                )}

                <label className="block text-sm text-zinc-300 mb-2">
                    E-mail
                </label>
                <input
                    type="email"
                    placeholder="seu@email.com"
                    className={inputClass}
                    {...register("email")}
                />

                {errors.email && (
                    <p className="text-xs text-red-500">
                        {errors.email.message}
                    </p>
                )}

                <label className="block text-sm text-zinc-300 mb-2">
                    Senha (mín. 8 caracteres)
                </label>
                <p className="text-xs text-zinc-400">
                    A senha deve ter pelo menos 8 caracteres, incluindo letra,
                    número e símbolo.
                </p>
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className={`${inputClass} pr-10`}
                        {...register("password")}
                    />

                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                    >
                        {showPassword ? (
                            <EyeOff size={18} />
                        ) : (
                            <Eye size={18} />
                        )}
                    </button>
                </div>

                {errors.password && (
                    <p className="text-xs text-red-500">
                        {errors.password.message}
                    </p>
                )}

                {apiError && (
                    <p className="text-sm text-red-500 text-center">
                        {apiError}
                    </p>
                )}

                <button
                    type="submit"
                    className="w-full bg-[#9333EA] flex items-center justify-center rounded-2xl py-4 gap-2 font-semibold cursor-pointer"
                    disabled={isSubmitting}
                >
                    <span>
                        {" "}
                        {isSubmitting ? "Criando conta..." : "Criar conta"}
                    </span>
                    <Image
                        src={ArrowIcon}
                        alt="imagem de seta da página de login"
                    />
                </button>
            </form>
        </AuthLayout>
    );
}
