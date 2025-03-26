"use client";

import React from "react";

interface FinancialData {
    month: string;
    monthExpense: number;
    monthIncome: number;
}

const FinanceInfo = () => {
    const financialData: FinancialData = {
        month: "Maret",
        monthExpense: 123456789,
        monthIncome: 213456789
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR'
        }).format(amount)
    }

    return (
        <div className="flex flex-col items-center p-6 rounded-lg shadow-lg bg-white w-11/12">
            <h1 className="text-2xl font-semibold mb-4">Laporan Keuangan</h1>
            <p>Bulan {financialData.month}</p>
            <div className="flex flex-row items-center justify-between">
                <div>
                    <p className="text-sm text-gray-600">Total Pengeluaran</p>
                    <p className="text-lg font-bold text-green-600">
                        {formatCurrency(financialData.monthExpense)}
                    </p>
                </div>
                <div>
                    <p className="text-sm text-gray-600">Total Pemasukan</p>
                    <p className="text-lg font-bold text-green-600">
                        {formatCurrency(financialData.monthIncome)}
                    </p>
                </div>
            </div>
        </div>
    )
};

export default FinanceInfo;