"use client"

import { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function RealtimeChart({ tenantId }: { tenantId: string }) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://media-stat.rumex.lk/common-stat/last3hours-per-minute`, {
          headers: {
            "X-Tenant-Id": tenantId,
          },
        })
        if (response.ok) {
          const result = await response.json()
          const formatted = result.map((item: any) => ({
            time: `${item.hour}:${String(item.minute).padStart(2, "0")}`,
            users: item.uniqueUserCount,
          }))
          setData(formatted)
        }
      } catch (err) {
        console.error("Failed to fetch realtime data:", err)
      } finally {
        setLoading(false)
      }
    }

    if (tenantId) {
      fetchData()
      const interval = setInterval(fetchData, 60000)
      return () => clearInterval(interval)
    }
  }, [tenantId])

  if (loading) {
    return <div className="bg-card border border-border rounded-lg p-6 h-80 animate-pulse" />
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-lg">
      <h2 className="text-lg font-semibold text-foreground mb-4">Last 3 Hours</h2>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgb(30, 41, 59)" />
            <XAxis dataKey="time" stroke="rgb(100, 116, 139)" />
            <YAxis stroke="rgb(100, 116, 139)" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgb(19, 27, 61)",
                border: "1px solid rgb(30, 41, 59)",
              }}
            />
            <Line type="monotone" dataKey="users" stroke="rgb(59, 130, 246)" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-muted text-center py-12">No data available</p>
      )}
    </div>
  )
}
