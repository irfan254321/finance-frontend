export type Income = {
    id: number
    name_income: string
    amount_income: number
    category_id: number
    date_income: string
}

export type Spending = {
    id: number
    name_spending: string
    amount_spending: number
    category_id: number
    date_spending: string
}

export type Medicine = {
    medicine_id: number
    name_medicine: string
    quantity: number
    name_unit?: string
    created_at: string
}

export type Category = {
    id: number
    name_category: string
}
