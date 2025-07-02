'use client'

import { useState, useEffect } from 'react'

export default function Home() {
    const targetUserId = "user1"; 

    const [userData, setUserData] = useState(null)
    const [userFiles, setUserFiles] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {

        async function fetchData() {
            setLoading(true); 
            setError(null);   

            try {
                const userResponse = await fetch(`/api/users/${targetUserId}`)
                if (!userResponse.ok) {
                    const errorBody = await userResponse.json();
                    throw new Error(`Error fetching user data: ${userResponse.status} - ${errorBody.message || userResponse.statusText}`);
                }
                const fetchedUserData = await userResponse.json()
                setUserData(fetchedUserData)

                const filesResponse = await fetch(`/api/users/${fetchedUserData.id}/files`)
                if (!filesResponse.ok) {
                    const errorBody = await filesResponse.json();
                    throw new Error(`Error fetching file data: ${filesResponse.status} - ${errorBody.message || filesResponse.statusText}`);
                }
                const fetchedFilesData = await filesResponse.json()
                setUserFiles(fetchedFilesData)

            } catch (err) {
                console.error("Failed to fetch data for Home page:", err)
                setError(err.message)
            } finally {
                setLoading(false) 
            }
        }

        fetchData()
    }, [targetUserId]) 


    if (loading) {
        return <div className="text-xl p-4">Loading user files...</div>
    }

    if (error) {
        return <div className="text-red-500 text-xl p-4">Error: {error}</div>
    }

    if (!userData) {
        return <div className="text-xl p-4">User data for ID "{targetUserId}" could not be loaded. Please check if user exists.</div>
    }

    if (!userFiles || userFiles.length === 0) {
        return (
            <div className="p-4">
                <h1 className="mb-4 text-2xl font-semibold">Wolke</h1>
                <h2 className="mb-2 font-semibold">{userData.username || userData.id}'s Files</h2> 
                <div className="text-lg mt-4">No files found for this user.</div>
            </div>
        )
    }

    return (
        <div className="p-4 text-white"> 
            <h1 className="mb-4 text-2xl font-semibold">Wolke</h1>
            <h2 className="mb-2 font-semibold">{userData.username || userData.id}'s Files</h2> 
            <table className="border-collapse border-spacing-0 w-full">
                <thead>
                    <tr className="bg-neutral-700">
                        <th className="pl-2 py-2 text-left">ID</th> 
                        <th className="px-4 py-2 text-left">Name</th> 
                        <th className="px-4 py-2 text-right">Size (MB)</th>
                        <th className="px-4 py-2 text-left">Date Created</th> 
                        <th className="px-4 py-2 text-left">Last Modified</th>
                        <th className="pr-2 py-2 text-left">Type</th> 
                    </tr>
                </thead>
                <tbody>
                    {userFiles.map((file) => (
                        <tr key={file.id} className="even:bg-neutral-800"> 
                            <td className="pl-2 py-1">{file.id}</td> 
                            <td className="px-4 py-1">{file.name}</td> 
                            <td className="px-4 py-1 text-right">{file.size.toFixed(2)}</td> 
                            <td className="px-4 py-1">{file.date}</td> 
                            <td className="px-4 py-1">{file.changedate}</td> 
                            <td className="pr-2 py-1">{file.type}</td> 
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
