"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import RoleGuard from "@/app/auth/RoleGuard";

const SlIcon = dynamic(
  () => import("@shoelace-style/shoelace/dist/react/icon/index.js"),
  {
    loading: () => <p>Loading...</p>,
    ssr: false,
  }
);

interface FinancialData {
    month: string;
    year: string;
    monthExpense: number;
    monthIncome: number;
    monthCheck: number;
}

const FinanceInfo = () => {
    const [financialData, setFinancialData] = useState<FinancialData | null>(null);
    const [editableData, setEditableData] = useState<FinancialData | null>(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [saving, setSaving] = useState(false);

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
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
        }).format(amount);
    };

    const handleEditClick = () => {
        if (!financialData) return;
        setEditMode(true);
        setEditableData({ ...financialData });
    };

    const handleCancelClick = () => {
        setEditMode(false);
        setEditableData(null);
    };

    const handleChange = (field: keyof FinancialData, value: string) => {
        if (!editableData) return;
        setEditableData({
            ...editableData,
            [field]: parseFloat(value),
        });
    };

    const handleSaveClick = async () => {
        if (!editableData) return;

        setSaving(true);
        try {
            const response = await fetch("http://localhost:8000/api/update-finance", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(editableData),
            });

            const result = await response.json();

            if (response.ok) {
                setFinancialData(editableData);
                setEditMode(false);
            } else {
                console.error("Gagal menyimpan data:", result.message);
            }
        } catch (error) {
            console.error("Error saat menyimpan data:", error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="p-6 text-center">Loading...</div>;
    }

    if (!financialData) {
        return <div className="p-6 text-center text-red-600">Gagal mengambil data keuangan.</div>;
    }

    return (
        <div className="flex flex-col p-4 pl-6 rounded-lg bg-white w-11/12 space-y-4">
            <div className="flex justify-between">
                <h1 className="text-2xl font-semibold mb-4">Informasi Keuangan</h1>
                <p className="mt-2 mr-2 text-sm text-gray-600">{new Date().toLocaleString('id-ID', { month: 'long' })} {financialData.year}</p>
            </div>
            {/* <h1 className="self-start text-2xl font-semibold mb-4">Informasi Keuangan</h1>
            <p className="self-start text-sm text-gray-600">Bulan {new Date().toLocaleString('id-ID', { month: 'long' })} {financialData.year}</p> */}

            <div className="flex flex-col items-center justify-between w-full space-y-3">
                <div className="text-left w-full">
                    <p className="text-sm text-gray-600">Total Pengeluaran</p>
                    {editMode ? (
                        <input
                            type="number"
                            className="border rounded p-1 w-full"
                            value={editableData?.monthExpense || 0}
                            onChange={(e) => handleChange("monthExpense", e.target.value)}
                        />
                    ) : (
                        <p className="text-lg font-bold text-red-600 pl-5">
                            {formatCurrency(financialData.monthExpense)}
                        </p>
                    )}
                </div>

                <div className="text-left w-full">
                    <p className="text-sm text-gray-600">Total Pemasukan</p>
                    {editMode ? (
                        <input
                            type="number"
                            className="border rounded p-1 w-full"
                            value={editableData?.monthIncome || 0}
                            onChange={(e) => handleChange("monthIncome", e.target.value)}
                        />
                    ) : (
                        <p className="text-lg font-bold text-green-600 pl-5">
                            {formatCurrency(financialData.monthIncome)}
                        </p>
                    )}
                </div>

                <div className="text-left w-full">
                    <p className="text-sm text-gray-600">Saldo Bulan Ini</p>
                    {editMode ? (
                        <input
                            type="number"
                            className="border rounded p-1 w-full"
                            value={editableData?.monthCheck || 0}
                            onChange={(e) => handleChange("monthCheck", e.target.value)}
                        />
                    ) : (
                        <p className="text-lg font-bold text-blue-600 pl-5">
                            {formatCurrency(financialData.monthCheck)}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex space-x-3 mt-4 bg-blue w-full justify-end">
                {editMode ? (
                    <>
                        <button
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
                            onClick={handleSaveClick}
                            disabled={saving}
                        >
                            {saving ? "Menyimpan..." : "Simpan"}
                        </button>
                        <button
                            className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                            onClick={handleCancelClick}
                            disabled={saving}
                        >
                            Batal
                        </button>
                    </>
                ) : (
                    <RoleGuard allowedRoles={["manajemen"]}>
                        <button
                            className="bg-blue-500 hover:bg-blue-600 cursor-pointer rounded-sm w-10 h-7 flex items-center justify-center"
                            onClick={handleEditClick}
                        >
                            <SlIcon name="pencil" label="Edit" className="text-white"></SlIcon>
                        </button>
                    </RoleGuard>
                )}
            </div>
        </div>
    );
};

export default FinanceInfo;
