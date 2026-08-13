import { NextResponse } from "next/server";
import OpenAI from "openai";
import { TRANSACTION_CATEGORY_LABELS } from "../../_constants/transaction";
import type { TransactionCategory } from "@prisma/client";

const MONTH_NAMES: Record<string, string> = {
    "01": "Janeiro",
    "02": "Fevereiro",
    "03": "Março",
    "04": "Abril",
    "05": "Maio",
    "06": "Junho",
    "07": "Julho",
    "08": "Agosto",
    "09": "Setembro",
    "10": "Outubro",
    "11": "Novembro",
    "12": "Dezembro",
};

interface CategorySummary {
    category: TransactionCategory;
    totalAmount: number;
    percentageOfTotal: number;
}

interface Body {
    month: string;
    year: number;
    depositsTotal: number;
    expensesTotal: number;
    investmentsTotal: number;
    balance: number;
    totalExpensePerCategory: CategorySummary[];
}

function formatBRL(value: number) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(value);
}

export async function POST(req: Request) {
    const apiKey = process.env.GSK_API_KEY;
    if (!apiKey) {
        return NextResponse.json(
            { error: "GSK_API_KEY não configurada." },
            { status: 500 },
        );
    }

    let body: Body;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json(
            { error: "Corpo da requisição inválido." },
            { status: 400 },
        );
    }

    const {
        month,
        year,
        depositsTotal = 0,
        expensesTotal = 0,
        investmentsTotal = 0,
        balance = 0,
        totalExpensePerCategory = [],
    } = body;

    const monthName = MONTH_NAMES[month] ?? month;
    const categoryLabels = totalExpensePerCategory
        .map((item: CategorySummary) => {
            const label =
                TRANSACTION_CATEGORY_LABELS[item.category] ?? item.category;
            return `${label}: ${formatBRL(item.totalAmount)} (${item.percentageOfTotal}% do total de despesas)`;
        })
        .join("\n");

    const openai = new OpenAI({
        apiKey,
        baseURL: "https://api.groq.com/openai/v1",
    });

    const userContent = `Analise os dados financeiros de ${monthName} de ${year}.

Dados:
- Ganhos: ${formatBRL(depositsTotal)}
- Gastos: ${formatBRL(expensesTotal)}
- Investimentos: ${formatBRL(investmentsTotal)}
- Saldo: ${formatBRL(balance)}

Gastos por categoria:
${categoryLabels || "Nenhum gasto registrado."}

Responda em português do Brasil de forma extremamente resumida e direta (máximo de 2 parágrafos curtos). Sem introduções longas. Inclua apenas:
1) Avaliação em uma frase do saldo do mês.
2) Uma sugestão rápida de como reduzir a categoria de maior gasto.
3) Apenas 1 dica prática para o próximo mês.`;

    try {
        const completion = await openai.chat.completions.create({
            model: "openai/gpt-oss-20b",
            messages: [
                {
                    role: "system",
                    content:
                        "Você é um consultor financeiro objetivo. Dê sugestões práticas e evite textos longos ou repetição de dados. Suas respostas devem ir direto ao ponto e não podem ultrapassar 2 parágrafos curtos.",
                },
                { role: "user", content: userContent },
            ],
            max_completion_tokens: 350,
            temperature: 0.5,
        });

        const suggestion =
            completion.choices[0]?.message?.content?.trim() ??
            "Não foi possível gerar a análise no momento. Tente novamente.";

        const topCategory = totalExpensePerCategory.length
            ? totalExpensePerCategory.reduce((a, b) =>
                  a.totalAmount >= b.totalAmount ? a : b,
              )
            : null;

        const topCategoryLabel = topCategory
            ? (TRANSACTION_CATEGORY_LABELS[topCategory.category] ??
              topCategory.category)
            : null;

        return NextResponse.json({
            suggestion,
            topCategory: topCategoryLabel,
            topCategoryAmount: topCategory
                ? formatBRL(topCategory.totalAmount)
                : null,
        });
    } catch (err) {
        console.error("Groq API error:", err);
        return NextResponse.json(
            { error: "Erro ao gerar insights. Tente novamente mais tarde." },
            { status: 500 },
        );
    }
}
