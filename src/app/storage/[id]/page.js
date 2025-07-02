'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

export default function Storage() {
    const params = useParams()
    const { id } = params

    const [userData, setUserData] = useState(null)
    const [userFiles, setUserFiles] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!id) {
            setLoading(false)
            setError("No id provided in the URL.")
            return;
        }

        async function fetchData() {
            try {
                const userResponse = await fetch(`/api/users/${id}`)

                if (!userResponse.ok) {
                    const errorText = await userResponse.text()
                    throw new Error(`Error fetching user data: ${userResponse.status} ${errorText}`)
                }

                const userData = await userResponse.json()
                setUserData(userData)

                const filesResponse = await fetch(`/api/users/${userData.id}/files`)

                if (!filesResponse.ok) {
                    const errorText = await filesResponse.text()
                    throw new Error(`Error fetching file data: ${filesResponse.status} ${errorText}`)
                }

                const filesData = await filesResponse.json()
                setUserFiles(filesData)

            } catch (err) {
                console.error("Failed to fetch data:", err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [id])

    if (loading) {
        return <div className="text-xl p-4">Loading storage information...</div>
    }

    if (error) {
        return <div className="text-red-500 text-xl p-4">Error: {error}</div>
    }

    if (!userData || !userFiles) {
        return <div className="text-xl p-4">No storage data or files found for user "{username}".</div>
    }

    const totalStorageAmount = userData.storage_amount
    const storageInformation = {}
    const fileTypes = {}

    let usedStorageAmount = 0

    userFiles.forEach(file => {
        if (!fileTypes[file.type]) {
            fileTypes[file.type] = {
                totalAmount: 0,
                totalSize: 0,
                totalPercentage: 0
            };
        }

        fileTypes[file.type].totalAmount++;
        fileTypes[file.type].totalSize += file.size;
        usedStorageAmount += file.size;
    });

    Object.keys(fileTypes).forEach(type => {
        fileTypes[type].totalPercentage = (
            (fileTypes[type].totalSize / totalStorageAmount) * 100
        ).toFixed(2);
    });

    storageInformation["totalStorageAmount"] = totalStorageAmount;
    storageInformation["usedStorageAmount"] = usedStorageAmount;
    storageInformation["storageAnalysis"] = fileTypes;
    storageInformation["totalUsedStoragePercentage"] = (
        (usedStorageAmount / totalStorageAmount * 100).toFixed(2)
    ) + " %";

    return (
        <div className="p-4">
            <h1 className="mb-4 text-2xl font-semibold">Storage</h1>

            <div className="mb-2">
                <span className="font-semibold">Storage used:</span> {storageInformation.usedStorageAmount} MB / {storageInformation.totalStorageAmount} MB ({storageInformation.totalUsedStoragePercentage})
            </div>

            <table className="border-collapse border-spacing-0 w-full">
                <thead>
                    <tr className="bg-neutral-700">
                        <th className="pl-2 py-2 text-left">File type</th>
                        <th className="px-4 py-2 text-right">Total file count</th>
                        <th className="px-4 py-2 text-right">Total file size</th>
                        <th className="pr-2 py-2 text-right">Percentage of storage</th>
                    </tr>
                </thead>

                <tbody>
                    {Object.entries(storageInformation["storageAnalysis"]).map(([fileType, data]) => (
                        <tr key={fileType} className="even:bg-neutral-800">
                            <td className="pl-2 py-1">{fileType}</td>
                            <td className="px-4 py-1 text-right">{data.totalAmount}</td>
                            <td className="px-4 py-1 text-right">{data.totalSize} MB</td>
                            <td className="pr-2 py-1 text-right">{data.totalPercentage} %</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
