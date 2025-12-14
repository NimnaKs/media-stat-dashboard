"use client"

import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function TrendChart({ tenantId }: { tenantId: string }) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://media-stat.rumex.lk/common-stat/last-30days-per-day?mediaType=MOVIE`, {
          headers: {
            "X-Tenant-Id": tenantId,
          },
        })
        if (response.ok) {
          const result = await response.json()
          const formatted = result.slice(-7).map((item: any) => ({
            date: `${item.month}/${item.day}`,
            viewers: item.uniqueViewers,
            watchTime: Math.round(item.totalWatchTime / 216000),
          }))
          setData(formatted)
        }
      } catch (err) {
        console.error("Failed to fetch trend data:", err)
      } finally {
        setLoading(false)
      }
    }

    if (tenantId) {
      fetchData()
    }
  }, [tenantId])

  if (loading) {
    return <div className="bg-card border border-border rounded-lg p-6 h-80 animate-pulse" />
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-lg">
      <h2 className="text-lg font-semibold text-foreground mb-4">Last 7 Days Trend</h2>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgb(30, 41, 59)" />
            <XAxis dataKey="date" stroke="rgb(100, 116, 139)" />
            <YAxis stroke="rgb(100, 116, 139)" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgb(19, 27, 61)",
                border: "1px solid rgb(30, 41, 59)",
              }}
            />
            <Bar dataKey="viewers" fill="rgb(6, 182, 212)" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-muted text-center py-12">No data available</p>
      )}
    </div>
  )
}
