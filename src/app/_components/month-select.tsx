'use client'

import { useRouter, useSearchParams } from "next/navigation"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/app/_components/ui/select"

export const MonthSelect = () => {
  const router = useRouter()
  const params = useSearchParams()

  const currentMonth = params.get("month") ?? "01"

  function handleChange(value: string) {
    router.push(`/?month=${value}`)
  }

  return (
    <Select value={currentMonth} onValueChange={handleChange}>
      <SelectTrigger className="w-[140px] bg-[#0F111A] text-white border-gray-700 focus:ring-2 focus:ring-blue-500">
        <SelectValue placeholder="Mês" />
      </SelectTrigger>

      <SelectContent className="bg-[#0F111A] text-white border-gray-700">
        <SelectItem value="01">Janeiro</SelectItem>
        <SelectItem value="02">Fevereiro</SelectItem>
        <SelectItem value="03">Março</SelectItem>
        <SelectItem value="04">Abril</SelectItem>
        <SelectItem value="05">Maio</SelectItem>
        <SelectItem value="06">Junho</SelectItem>
        <SelectItem value="07">Julho</SelectItem>
        <SelectItem value="08">Agosto</SelectItem>
        <SelectItem value="09">Setembro</SelectItem>
        <SelectItem value="10">Outubro</SelectItem>
        <SelectItem value="11">Novembro</SelectItem>
        <SelectItem value="12">Dezembro</SelectItem>
      </SelectContent>
    </Select>
  )
}