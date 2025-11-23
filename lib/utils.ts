export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ")
}

export const MONTHS_ID = Array.from({ length: 12 }, (_, i) => i + 1)
export const MONTHS_LABEL = MONTHS_ID.map((m) =>
    new Date(2024, m - 1).toLocaleString("id-ID", { month: "long" })
)

export const formatRp = (n: number) =>
    "Rp " + (n || 0).toLocaleString("id-ID", { maximumFractionDigits: 0 })