"use client";
import Image from "next/image";
import { Inter } from "next/font/google";

import dashboardIcon from "@/src/assets/sidebar/dashboard-icon.png";
import transactionsIcon from "@/src/assets/sidebar/transactions-icon.png";
import logo from "@/src/assets/sidebar/logo-icon.png";
import { Logout } from "./logout";
import Link from "next/link";
import { usePathname } from "next/navigation";

const inter = Inter({
    subsets: ["latin"],
    weight: ["400", "500", "700"],
});

export default function Sidebar() {
    const pathname = usePathname();

    const isDashboard = pathname === "/";
    const isTransactions = pathname === "/transactions";

    return (
        <aside
            className={`${inter.className} flex md:w-64 w-[68px] flex-col border-r border-[#1E293B] bg-[#0F111A] text-[#F1F5F9]`}
        >
            <Link href={"/"}>
            <div className="flex flex-col items-center md:flex-row md:gap-3 px-4 md:px-6 py-6">
                <div className="bg-[#9333EA] rounded-xl py-4 px-2.5">
                    <Image src={logo} alt="FinTrack" priority />
                </div>

                <p className="md:text-xl text-sm p-2 font-bold leading-5 tracking-[-0.025em]">
                    FinTrack
                </p>
            </div>
            </Link>
            

            <nav className="flex flex-1 flex-col gap-2 px-2 md:px-4 py-4">
                <Link
                    href="/"
                    className={`flex w-full items-center gap-3 rounded-xl ${isDashboard ? "bg-[#9333EA] text-white" : "text-white"} px-4 py-3`}
                >
                    <Image
                        src={dashboardIcon}
                        alt="icone de dashboard"
                    />
                    <span className="hidden md:block text-base font-medium leading-normal">
                        Dashboard
                    </span>
                </Link>

                <Link
                    href="/transactions"
                    className={`flex w-full items-center gap-3 rounded-xl ${isTransactions ? "bg-[#9333EA] text-white" : "text-[#94A3B8]"} px-4 py-3`}
                >
                    <Image
                        src={transactionsIcon}
                        alt="icone de transações"

                    />
                    <span className="hidden md:block text-base font-medium leading-normal">
                        Transações
                    </span>
                </Link>
            </nav>

            <div className="border-t border-[#1E293B] px-6 py-6">
                <Logout />
            </div>
        </aside>
    );
}
