"use client";

import React from "react";

interface FinancialData {
    date: string
    monthExpense: number;
    monthIncome: number;
    monthCheck: number
}

const FinanceInfo = () => {
    const financialData: FinancialData = {
        date: "Maret 2025",
        monthExpense: 123456789,
        monthIncome: 213456789,
        monthCheck: 100000000
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR'
        }).format(amount)
    }

    return (
        <div className="flex flex-col items-center p-6 rounded-lg shadow-lg bg-white w-11/12 space-y-4">
            <h1 className="text-2xl font-semibold mb-4">Laporan Keuangan</h1>
            <p className="text-sm text-gray-600">Bulan {financialData.date}</p>
            <div className="flex flex-row items-center justify-between w-full space-x-6">
                <div className="flex-1 text-center">
                    <p className="text-sm text-gray-600">Total Pengeluaran</p>
                    <p className="text-lg font-bold text-red-600">
                        {formatCurrency(financialData.monthExpense)}
                    </p>
                </div>
                <div className="flex-1 text-center">
                    <p className="text-sm text-gray-600">Total Pemasukan</p>
                    <p className="text-lg font-bold text-green-600">
                        {formatCurrency(financialData.monthIncome)}
                    </p>
                </div>
                <div className="flex-1 text-center">
                    <p className="text-sm text-gray-600">Saldo Bulan Ini</p>
                    <p className="text-lg font-bold text-blue-600">
                        {formatCurrency(financialData.monthCheck)}
                    </p>
                </div>
            </div>
        </div>
    )
};

export default FinanceInfo;