// components/CryptoTicker.tsx
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
            'https://api.coingecko.com/api/v3/coins/markets?vs_currency=brl&order=market_cap_desc&per_page=5&page=1&sparkline=false'
        )
            .then(res => res.json())
            .then(data => setCoins(data))
            .catch(err => console.error('Erro ao carregar criptos:', err))
    }, [])

    return (
        <div className="flex gap-4 flex-wrap justify-center text-sm py-2 border-b border-lime-800 bg-black/30 text-gray-200">
            {coins.map((coin) => (
                <div key={coin.id} className="flex items-center gap-2">
                    <span className="font-semibold">{coin.name}:</span>
                    <span>${coin.current_price.toFixed(2)}</span>
                    <span
                        className={`text-sm R${coin.price_change_percentage_24h >= 0 ? "text-green-400" : "text-red-400"
                            }`}
                    >
                        {coin.price_change_percentage_24h.toFixed(2)}%
                    </span>
                </div>
            ))}
        </div>
    )
}
