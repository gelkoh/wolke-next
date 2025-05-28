import filesData from "../../public/data/files.json"
import usersData from "../../public/data/users.json"

export default function Home() {
    // const userFiles = files.user1

    const targetUserId = "user1";
    const currentUser = usersData.find(user => user.id === targetUserId);
    const userFiles = filesData[targetUserId];
    const userName = currentUser ? currentUser.username : "Unknown User";

    if (!currentUser || !userFiles) {
        return <p>User or files not found.</p>;
    }

    return (
        <div>
            <h1 className="mb-4 text-2xl font-semibold">Wolke</h1>
                <h2 className="mb-2 font-semibold">{userName}'s Files</h2> 
                <table className="border-collapse border-spacing-0">
                <thead>
                    <tr className="bg-neutral-700">
                        <th className="pl-2">ID</th>
                        <th className="pl-2">Name</th>
                        <th className="pl-2">Size (MB)</th>
                        <th className="pl-2">Date Created</th>
                        <th className="pl-2">Last Modified</th>
                        <th className="pl-2">Type</th>
                    </tr>
                </thead>
                <tbody>
                    {userFiles.map((file) => (
                        <tr key={file.id}> 
                        <td className="pl-2">{file.id}</td>
                        <td className="pl-2">{file.name}</td>
                        <td className="pl-2">{file.size}</td>
                        <td className="pl-2">{file.date}</td>
                        <td className="pl-2">{file.changedate}</td>
                        <td className="pl-2">{file.type}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
