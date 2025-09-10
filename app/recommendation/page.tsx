import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getRecommendationById } from "@/actions/food-recommendation"
import { RecommendationContent } from "@/components/recommendation-content"

// 더미 추천 데이터 (ID가 없거나 데이터를 찾을 수 없는 경우 사용)
const fallbackRecommendation = {
  id: "fallback",
  timestamp: new Date().toISOString(),
  foodName: "오늘의 추천 음식",
  category: "추천 음식",
  reason: "당신의 기분과 날씨에 맞는 맛있는 음식을 추천해 드립니다.",
  ingredients: ["신선한 재료", "특별한 양념", "비밀 소스"],
  recipe: "맛있게 조리해서 즐겁게 드세요!",
  input: {
    mood: "hungry",
    weather: "sunny",
    dietaryPreferences: [],
    allergies: [],
  },
}

export default async function RecommendationPage({
  searchParams,
}: {
  searchParams: { id?: string }
}) {
  const id = searchParams.id

  // ID가 없는 경우 기본 페이지 표시
  if (!id) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FFE1C6] to-[#FFCBA4]">
        <div className="container mx-auto px-4 py-8">
          <Link href="/" className="inline-flex items-center text-[#994D25] hover:text-[#FF6B35] mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            돌아가기
          </Link>

          <Card className="max-w-2xl mx-auto shadow-lg">
            <CardHeader className="bg-[#FF6B35] text-white rounded-t-lg text-center">
              <CardTitle className="text-2xl">추천 정보를 찾을 수 없습니다</CardTitle>
            </CardHeader>
            <CardContent className="p-6 text-center">
              <p className="mb-4">유효한 추천 ID가 제공되지 않았습니다.</p>
              <Link href="/">
                <Button className="bg-[#FF6B35] hover:bg-[#E85826]">홈으로 돌아가기</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // 서버에서 추천 데이터 가져오기
  const recommendation = (await getRecommendationById(id)) || fallbackRecommendation

  return <RecommendationContent recommendation={recommendation} />
}
