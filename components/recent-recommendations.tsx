"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getRecentRecommendations } from "@/actions/food-recommendation"

type Recommendation = {
  id: string
  foodName: string
  timestamp: string
}

export function RecentRecommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecentRecommendations = async () => {
      try {
        const data = await getRecentRecommendations()
        setRecommendations(data)
      } catch (error) {
        console.error("최근 추천 목록을 가져오는데 실패했습니다:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecentRecommendations()
  }, [])

  return (
    <Card className="shadow-lg h-auto">
      <CardHeader className="bg-[#994D25] text-white rounded-t-lg py-3">
        <CardTitle className="text-base">최근 추천 목록</CardTitle>
      </CardHeader>
      <CardContent className="pt-3 px-3 max-h-[300px] overflow-y-auto">
        {loading ? (
          <div className="flex justify-center py-4">
            <div className="animate-pulse space-y-2 w-full">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 bg-gray-200 rounded-md" />
              ))}
            </div>
          </div>
        ) : recommendations.length > 0 ? (
          <ul className="space-y-1">
            {recommendations.map((rec) => (
              <li key={rec.id}>
                <Link
                  href={`/recommendation?id=${rec.id}`}
                  className="block p-2 rounded-md hover:bg-orange-50 transition-colors"
                >
                  <div className="font-medium text-[#FF6B35] text-sm">{rec.foodName}</div>
                  <div className="text-xs text-gray-500">{new Date(rec.timestamp).toLocaleString()}</div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="py-4 text-center text-gray-500 text-sm">아직 추천 기록이 없습니다</div>
        )}
      </CardContent>
    </Card>
  )
}
