import files from "../../../public/data/files.json"
import users from "../../../public/data/users.json"

export default function Storage() {
    const userFiles = files.user1
    const totalStorageAmount = users[0].storage_amount
    const storageInformation = {}
    const fileTypes = {}

    userFiles.forEach(file => {
        if (!fileTypes[file.type]) {
            fileTypes[file.type] = {
                totalAmount: 0,
                totalSize: 0,
                totalPercentage: 0
            }
        }

        fileTypes[file.type].totalAmount++
        fileTypes[file.type].totalSize += file.size
    })

    Object.keys(fileTypes).forEach(type => {
        fileTypes[type].totalPercentage = (
            (fileTypes[type].totalSize / totalStorageAmount) * 100
        ).toFixed(2);
    })

    let usedStorageAmount = 0

    userFiles.forEach(file => {
        usedStorageAmount += file.size
    })

    storageInformation["totalStorageAmount"] = totalStorageAmount
    storageInformation["usedStorageAmount"] = usedStorageAmount
    storageInformation["storageAnalysis"] = fileTypes
    storageInformation["totalUsedStoragePercentage"] = (usedStorageAmount / totalStorageAmount * 100).toFixed(2) + " %"

    return (
        <div>
            <h1 className="mb-4 text-2xl font-semibold">Storage</h1>

            <div className="mb-2"><span className="font-semibold">Storage used:</span> {storageInformation.usedStorageAmount} MB / {storageInformation.totalStorageAmount} MB ({storageInformation.totalUsedStoragePercentage})</div>

            <table className="border-collapse border-spacing-0">
                <thead>
                    <tr className="bg-neutral-700">
                        <th className="pl-2">File type</th>
                        <th className="pl-16 py-1">Total file count</th>
                        <th className="pl-16 py-1">Total file size</th>
                        <th className="pl-16 py-1 pr-2">Percentage of storage</th>
                    </tr>
                </thead>

                <tbody>
                    {Object.entries(storageInformation["storageAnalysis"]).map(([fileType, data]) => (
                        <tr key={fileType} className="even:bg-neutral-800">
                            <td className="pl-2">{fileType}</td>
                            <td className="pl-16 py-1">{data.totalAmount}</td>
                            <td className="pl-16 py-1">{data.totalSize} MB</td>
                            <td className="pl-16 py-1 pr-2">{data.totalPercentage} %</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
