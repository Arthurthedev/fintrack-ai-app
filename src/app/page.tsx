import BalanceCard from "./_components/balance-card";
import FinancialMetricCard from "./_components/financial-metric-card";
import Header from "./_components/header";
import Sidebar from "./_components/sidebar";
import ChartCard from "./_components/chart-card";
import AiInsights from "./_components/ai-insights";
import RecentTransactions from "./_components/recent-transactions";
import { getDashboard } from "./_data/get-dashboard";
import dayjs from "dayjs";

interface DashboardPageProps {
    searchParams: {
        month?: string;
    };
}
export default async function Home({ searchParams }: DashboardPageProps) {
    const params = await searchParams;
    const month = params.month ?? dayjs().format("MM");
    const data = await getDashboard(month);
    return (
        <div className="flex min-h-[100dvh] overflow-x-hidden bg-[#0F111A]">
            <Sidebar />
            <div className="flex flex-1 flex-col min-w-0">
                <Header userName={data.session.user.name} />
                <main className="flex-1 min-w-0 p-4 md:p-8 space-y-8">
                    <section className="grid lg:grid-cols-3 grid-cols-1 gap-6">
                        <div className="lg:col-span-2 col-span-1">
                            <BalanceCard
                                balance={data.balance}
                                revenues={data.depositsTotal}
                                expenses={data.expensesTotal}
                            />
                        </div>
                        <FinancialMetricCard
                            economy={data.economyPercentage}
                            economyValue={data.economyBalance}
                        />
                    </section>
                    <section className="flex flex-col lg:flex-row gap-8">
                        <div className="flex-1">
                            <ChartCard
                                depositsTotal={data.depositsTotal}
                                expensesTotal={data.expensesTotal}
                                investmentsTotal={data.investmentsTotal}
                                balance={data.balance}
                            />
                        </div>
                        <div className="flex-1">
                            <AiInsights 
                            month={month}
                            year={2026}
                            depositsTotal={data.depositsTotal}
                            expensesTotal={data.expensesTotal}
                            investmentsTotal={data.investmentsTotal}
                            balance={data.balance}
                            totalExpensePerCategory={data.totalExpensePerCategory}
                            />
                        </div>
                    </section>

                    <section>
                        <RecentTransactions/>
                    </section>
                </main>
            </div>
        </div>
    );
}
