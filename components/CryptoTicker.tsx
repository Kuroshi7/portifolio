'use client'
import { useEffect, useState } from "react"

interface Coin {
    id: string
    symbol: string
    name: string
    current_price: number
    price_change_percentage_24h: number
}

export default function CryptoTicker() {
    const [coins, setCoins] = useState<Coin[]>([])

    useEffect(() => {
        fetch(
            'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false'
        )
            .then(res => res.json())
            .then(data => setCoins(data))
            .catch(err => console.error('Erro ao carregar criptos:', err))
    }, [])

    return (
        <div className="relative overflow-hidden border-b border-t border-lime-800 bg-black/30 text-gray-200 pb-6 pt-1 px-4 text-sm">
            <div className="absolute animate-marquee whitespace-nowrap flex gap-6">
                {[...coins, ...coins, ...coins].map((coin, index) => (
                    <div key={`${coin.id}-${index}`} className="flex items-center gap-2 min-w-max px-2">
                        <span className="font-semibold">{coin.name}:</span>
                        <span>${coin.current_price.toFixed(2)}</span>
                        <span
                            className={`text-sm ${coin.price_change_percentage_24h >= 0 ? "text-green-400" : "text-red-400"}`}
                        >
                            {coin.price_change_percentage_24h.toFixed(2)}%
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}
