// src/components/LogTable.js (oder wo auch immer du es gespeichert hast)
'use client';

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function LogTable() {
    const params = useParams();
    const { id: userIdFromUrl } = params; // Holt die User-ID aus der URL

    const [rows, setRows] = useState([]);
    const [sortDirections, setSortDirections] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userIdFromUrl) {
            setLoading(false);
            setError("No user ID found in the URL to fetch logs.");
            return;
        }

        async function fetchLogsData() {
            try {
                // Ruft die Logs für den spezifischen Benutzer von deinem API-Endpunkt ab
                // Annahme: Dein API-Endpunkt ist /api/users/[id]/logs
                const response = await fetch(`/api/users/${userIdFromUrl}/logs`);

                console.log("Logs API Response Status:", response.status); // Debugging-Ausgabe

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Error fetching logs data: ${response.status} - ${errorText}`);
                }

                const logsData = await response.json();
                setRows(logsData); // Setzt die abgerufenen Logs in den State

            } catch (err) {
                console.error("Failed to fetch logs:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchLogsData();
    }, [userIdFromUrl]); // Abhängigkeit von userIdFromUrl, damit der Effekt bei Änderung neu läuft

    const sortTable = (columnIndex) => {
        if (rows.length === 0) return;

        const currentDir = sortDirections[columnIndex] === "asc" ? "desc" : "asc";
        setSortDirections({ [columnIndex]: currentDir });

        const sorted = [...rows].sort((a, b) => {
            let valA, valB;

            switch (columnIndex) {
                case 0: // File name
                    valA = a.name;
                    valB = b.name;
                    break;
                case 1: // Action
                    valA = a.action;
                    valB = b.action;
                    break;
                case 2: // Date
                    valA = new Date(a.date);
                    valB = new Date(b.date);
                    break;
                default:
                    return 0;
            }

            if (valA < valB) return currentDir === "asc" ? -1 : 1;
            if (valA > valB) return currentDir === "asc" ? 1 : -1;
            return 0;
        });

        setRows(sorted);
    };

    const renderArrow = (colIndex) => {
        if (sortDirections[colIndex] === "asc") return "↓";
        if (sortDirections[colIndex] === "desc") return "↑";
        return "";
    };

    if (loading) {
        return <div className="text-xl p-4">Loading user logs...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-xl p-4">Error: {error}</div>;
    }

    if (rows.length === 0) {
        return <div className="text-xl p-4">No logs available for user "{userIdFromUrl}".</div>;
    }

    return (
        <div>
            <h1 className="mb-4 text-2xl font-semibold">File History for {userIdFromUrl}</h1>

            <table className="border-collapse border-spacing-0 w-full">
                <thead>
                    <tr className="bg-neutral-700">
                        <th className="pl-2 cursor-pointer text-left py-2" onClick={() => sortTable(0)}>
                            File name {renderArrow(0)}
                        </th>
                        <th className="pl-16 py-2 cursor-pointer text-left" onClick={() => sortTable(1)}>
                            Action {renderArrow(1)}
                        </th>
                        <th className="pl-16 py-2 pr-2 cursor-pointer text-left" onClick={() => sortTable(2)}>
                            Date {renderArrow(2)}
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {rows.map((row, idx) => (
                        <tr key={idx} className="even:bg-neutral-800">
                            <td className="pl-2 py-1">{row.name}</td>
                            <td className="pl-16 py-1">{row.action}</td>
                            <td className="pl-16 py-1 pr-2">{row.date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
