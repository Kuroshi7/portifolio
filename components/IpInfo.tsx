"use client"
import { useEffect, useState } from "react"


interface info {
    ip: string,
    city: string,
    region: string,
    timezone: string
}

export default function IpInfo() {
    const [ipInfo, setIpInfo] = useState<info | null>(null)

    useEffect(() => {
        fetch('https://ipinfo.io/json')
            .then((res) => res.json())
            .then((data) => setIpInfo(data))
            .catch(err => console.error('Erro ao carregar informações:', err))

    }, []);


    return (
        <div className="flex justify-center text-sm py-2 px-2 border border-lime-800 bg-black/30 text-gray-200">
            {ipInfo && (
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-center">
                    <p className="col-span-2 font-semibold text-lime-300">
                        YOU ARE ACCESSING FROM
                    </p>
                    <span>
                        <strong>City:</strong> {ipInfo.city}
                    </span>
                    <span>
                        <strong>Region:</strong> {ipInfo.region}
                    </span>
                    <span>
                        <strong>Time Zone:</strong> {ipInfo.timezone}
                    </span>
                    <span>
                        <strong>IP:</strong> {ipInfo.ip}
                    </span>
                </div>
            )}
        </div>
    )
}