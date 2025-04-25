"use client";

import React, { useEffect, useState } from "react";

interface FinancialData {
    month: string;
    year: string;
    monthExpense: number;
    monthIncome: number;
    monthCheck: number
}

const FinanceInfo = () => {
    const [financialData, setFinancialData] = useState<FinancialData | null>(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchFinanceData = async () => {
            try {
                const response = await fetch("http://localhost:8000/api/get-finance");
                const result = await response.json();

                if (response.ok && result.data) {
                    setFinancialData(result.data);
                } else {
                    console.error("Failed to fetch financial data:", result.message);
                }
            } catch (error) {
                console.error("Error fetching financial data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFinanceData();
    }, []);
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR'
        }).format(amount)
    }
    if (loading) {
        return <div className="p-6 text-center">Loading...</div>;
    }

    if (!financialData) {
        return <div className="p-6 text-center text-red-600">Gagal mengambil data keuangan.</div>;
    }
    return (
        <div className="flex flex-col items-center p-6 rounded-lg shadow-lg bg-white w-11/12 space-y-4">
            <h1 className="text-2xl font-semibold mb-4">Informasi Keuangan</h1>
            <p className="text-sm text-gray-600">Bulan {financialData.month} {financialData.year}</p>
            <div className="flex flex-col items-center justify-between w-full">
                <div className="flex-1 text-left w-full">
                    <p className="text-sm text-gray-600">Total Pengeluaran</p>
                    <p className="text-lg font-bold text-red-600 pl-5">
                        {formatCurrency(financialData.monthExpense)}
                    </p>
                </div>
                <div className="flex-1 text-left w-full">
                    <p className="text-sm text-gray-600">Total Pemasukan</p>
                    <p className="text-lg font-bold text-green-600 pl-5">
                        {formatCurrency(financialData.monthIncome)}
                    </p>
                </div>
                <div className="flex-1 text-left w-full">
                    <p className="text-sm text-gray-600">Saldo Bulan Ini</p>
                    <p className="text-lg font-bold text-blue-600 pl-5">
                        {formatCurrency(financialData.monthCheck)}
                    </p>
                </div>
            </div>
        </div>
    )
};

export default FinanceInfo;