import Head from 'next/head'
import useSWR from 'swr'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function AnalyticsPage() {
  const { data: priceStats } = useSWR<{average:number, min:number, max:number}>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/analytics/prices`, fetcher, { refreshInterval: 10000 })
  const { data: trends } = useSWR<{date:string, count:number}[]>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/analytics/trends`, fetcher, { refreshInterval: 10000 })

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <Head>
        <title>Analytics</title>
      </Head>

      <h1 className="text-4xl font-bold mb-6">Analytics Dashboard</h1>

      {priceStats && (
        <div className="bg-white p-4 rounded shadow mb-6">
          <h2 className="text-2xl font-semibold mb-2">Price Statistics</h2>
          <p>Average Price: ${priceStats.average.toLocaleString()}</p>
          <p>Minimum Price: ${priceStats.min.toLocaleString()}</p>
          <p>Maximum Price: ${priceStats.max.toLocaleString()}</p>
        </div>
      )}

      {trends && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-2xl font-semibold mb-2">Listings Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
