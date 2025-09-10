"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown, ChevronRight, Clock, Loader2 } from "lucide-react"
import { getRecentRecommendations } from "@/actions/food-recommendation"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface PreviousRecommendationsListProps {
  accentColor?: string
  variant?: "button" | "collapsible"
  onToggle?: (isOpen: boolean) => void
}

export function PreviousRecommendationsList({
  accentColor = "#FF6B35",
  variant = "collapsible",
  onToggle,
}: PreviousRecommendationsListProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isOpen && recommendations.length === 0) {
      fetchRecommendations()
    }
  }, [isOpen])

  const fetchRecommendations = async () => {
    setIsLoading(true)
    try {
      const data = await getRecentRecommendations()
      setRecommendations(data)
    } catch (error) {
      console.error("이전 추천 내역을 가져오는데 실패했습니다:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRecommendationClick = (id: string) => {
    router.push(`/recommendation?id=${id}`)
  }

  const handleToggle = (open: boolean) => {
    setIsOpen(open)
    if (onToggle) onToggle(open)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("ko-KR", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date)
  }

  if (variant === "button") {
    return (
      <Button
        variant="outline"
        className="gap-2 rounded-full"
        onClick={() => handleToggle(!isOpen)}
        style={{ borderColor: accentColor, color: accentColor }}
      >
        <Clock className="h-5 w-5" />
        추천 히스토리
      </Button>
    )
  }

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={handleToggle}
      className="w-full border rounded-lg overflow-hidden shadow-sm bg-white/40 backdrop-blur-sm border-white/40"
    >
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full flex justify-between items-center p-4 hover:bg-white/30">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" style={{ color: accentColor }} />
            <span className="font-medium" style={{ color: accentColor }}>
              추천 히스토리
            </span>
          </div>
          {isOpen ? (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronRight className="h-4 w-4 text-gray-500" />
          )}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="p-4 bg-white/30 border-t border-white/40">
          {isLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : recommendations.length > 0 ? (
            <ul className="space-y-2 max-h-60 overflow-y-auto">
              {recommendations.map((rec, index) => (
                <li
                  key={rec.id}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-white/50 transition-colors cursor-pointer"
                  onClick={() => handleRecommendationClick(rec.id)}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                    style={{ backgroundColor: accentColor }}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium" style={{ color: accentColor }}>
                      {rec.foodName}
                    </p>
                    <p className="text-xs text-gray-500">{formatDate(rec.timestamp)}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500 py-4">이전 추천 내역이 없습니다</p>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
