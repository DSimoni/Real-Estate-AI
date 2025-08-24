import Head from 'next/head'
import useSWR from 'swr'

type Listing = {
  id: number;
  title: string;
  link: string;
  price: number;
  createdAt: string;
  updatedAt: string;
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function Home() {
  const { data: listings, error } = useSWR<Listing[]>(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/listings`,
    fetcher,
    { refreshInterval: 5000 } // refresh every 5 seconds
  )

  if (error) return <div>Failed to load listings</div>
  if (!listings) return <div>Loading...</div>

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Head>
        <title>Real Estate Listings</title>
      </Head>

      <h1 className="text-4xl font-bold text-gray-800 mb-6">Real Estate Listings</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map(listing => (
          <div key={listing.id} className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold">{listing.title}</h2>
            <p className="text-gray-600 mt-2">Price: ${listing.price.toLocaleString()}</p>
            <a
              href={listing.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 mt-2 inline-block"
            >
              View Listing
            </a>
            <p className="text-gray-400 text-sm mt-1">Posted: {new Date(listing.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
