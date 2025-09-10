"use client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapAppButtons } from "@/components/map-app-buttons"
import { DeliveryAppButtons } from "@/components/delivery-app-buttons"
import { StarRating } from "@/components/star-rating"
import { SocialShare } from "@/components/social-share"
import { PreviousRecommendationsList } from "@/components/previous-recommendations-list"
import { FoodIllustrations } from "@/components/food-illustrations"
import { getFoodImageUrl } from "@/utils/food-image"
import { getNewRecommendation, saveRating } from "@/actions/food-recommendation"
import {
  Loader2,
  Smile,
  Cloud,
  CloudRain,
  Sun,
  Thermometer,
  Frown,
  Coffee,
  Utensils,
  CloudSnowIcon as Snow,
  Users,
  Heart,
  Home,
  User,
  CheckCircle2,
  RefreshCw,
  ArrowLeft,
  Clock,
} from "lucide-react"

interface RecommendationContentProps {
  recommendation: any
}

export function RecommendationContent({ recommendation: initialRecommendation }: RecommendationContentProps) {
  const router = useRouter()
  const [recommendation, setRecommendation] = useState(initialRecommendation)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [bgColor, setBgColor] = useState<string>("from-[#FFE1C6] to-[#FFCBA4]")
  const [accentColor, setAccentColor] = useState<string>("#FF6B35")
  const [emotionalMessage, setEmotionalMessage] = useState<string>("")
  const [historyOpen, setHistoryOpen] = useState(false)

  // 기분과 날씨에 따른 배경색 및 액센트 색상 설정
  useEffect(() => {
    if (recommendation?.input) {
      const { mood, weather } = recommendation.input

      if (mood === "happy") {
        setBgColor("from-[#FFF8E1] to-[#FFECB3]") // 밝은 노란색 계열
        setAccentColor("#FFB300") // 밝은 노란색 액센트
        setEmotionalMessage("이 음식이 당신의 행복한 기분을 더욱 빛나게 해줄 거예요 ✨")
      } else if (mood === "sad") {
        setBgColor("from-[#E3F2FD] to-[#BBDEFB]") // 어두운 파란색 계열
        setAccentColor("#1E88E5") // 파란색 액센트
        setEmotionalMessage(getRandomSadMessage())
      } else if (mood === "tired") {
        setBgColor("from-[#E8EAF6] to-[#C5CAE9]") // 연보라색 계열
        setAccentColor("#5C6BC0") // 보라색 액센트
        setEmotionalMessage(getRandomTiredMessage())
      } else if (mood === "hungry") {
        setBgColor("from-[#FBE9E7] to-[#FFCCBC]") // 연주황색 계열
        setAccentColor("#FF7043") // 주황색 액센트
        setEmotionalMessage("맛있는 식사로 허기를 달래보세요 🍽️")
      } else if (weather === "sunny") {
        setBgColor("from-[#FFF8E1] to-[#FFECB3]") // 밝은 노란색 계열
        setAccentColor("#FFB300") // 밝은 노란색 액센트
        setEmotionalMessage("화창한 날씨와 함께 즐기는 식사가 더 특별하게 느껴질 거예요 ☀️")
      } else if (weather === "rainy") {
        setBgColor("from-[#E3F2FD] to-[#BBDEFB]") // 어두운 파란색 계열
        setAccentColor("#1E88E5") // 파란색 액센트
        setEmotionalMessage("비 오는 날에는 이 음식과 함께 따뜻한 실내에서 편안한 시간을 보내세요 🌧️")
      } else {
        setBgColor("from-[#FFE1C6] to-[#FFCBA4]") // 기본 배경색
        setAccentColor("#FF6B35") // 기본 액센트 색상
        setEmotionalMessage("맛있는 식사 시간 되세요! 🍽️")
      }
    }
  }, [recommendation])

  // 우울한 기분일 때 랜덤 메시지
  const getRandomSadMessage = () => {
    const messages = [
  "오늘 하루가 힘들었나요? 이 음식이 작은 위로가 되길 바랍니다 🧚🏻‍♀️",
  "우울한 날에는 맛있는 음식이 때로는 최고의 위로가 될 수 있어요 💙",
  "당신의 기분이 나아지길 바라며, 이 음식이 작은 행복을 선사하길 바랍니다 🌈",
  "힘든 날도 맛있는 한 끼와 함께라면 조금은 나아질 수 있어요 🍀",
  "당신의 마음에 작은 위로가 되길 바라며 추천해 드립니다 🌷",
  "고단한 하루 끝, 따뜻한 한 끼가 당신을 토닥여주길 바래요 🫧",
  "오늘도 열심히 버텨낸 당신, 참 잘했어요 💛",
  "지친 하루를 보낸 당신에게, 이 음식이 포근한 안식처가 되길 🌙",
  "마음이 무거운 날엔 소소한 맛이 큰 힘이 되어줄 거예요 🍜",
  "세상이 버거울 때, 한 입의 음식이 다시 힘을 줄 수 있어요 🍚",
  "슬픈 날엔 달콤함이 약이 될 수도 있어요, 스스로를 아껴주세요 🍯",
  "누군가의 따뜻한 말보다, 때로는 따뜻한 음식이 더 큰 위로가 되죠 🍲",
  "당신은 혼자가 아니에요. 이 음식이 함께 있어줄게요 🤍",
  "조금 느려도 괜찮아요. 맛있는 걸 먹는 동안은 걱정을 잠시 내려놔요 🐢",
  "오늘은 그냥, 따뜻한 거 한 입 하면서 푹 쉬어요 🫖"]
    return messages[Math.floor(Math.random() * messages.length)]
  }

  // 피곤한 기분일 때 랜덤 메시지
  const getRandomTiredMessage = () => {
    const messages = [
  "오늘 하루 정말 수고 많으셨어요. 이 음식으로 에너지를 충전하세요 🌙",
  "피곤한 하루 끝에는 맛있는 음식이 최고의 보상이 될 수 있어요 ✨",
  "당신의 노고를 위로해줄 맛있는 한 끼를 준비했어요 🍽️",
  "지친 몸과 마음에 휴식과 함께 이 음식이 활력을 불어넣길 바랍니다 🌿",
  "오늘도 열심히 달려온 당신, 이제는 맛있는 음식과 함께 쉬어가세요 💤",
  "하루의 피로를 녹여줄 따뜻한 맛, 지금 준비했어요 🍲",
  "몸도 마음도 지쳤다면 이 한 끼로 충전해보세요 🔋",
  "오늘도 고생 많았어요. 이 음식이 작은 응원이 되길 바라요 💪",
  "따뜻한 한 끼로 당신의 하루가 부드럽게 마무리되길 바랍니다 🧡",
  "당신이 얼마나 열심히 살고 있는지 알아요. 이제는 스스로를 챙겨주세요 🍛",
  "긴 하루 끝, 가장 맛있는 위로가 되어줄 음식이에요 🧆",
  "속이 따뜻해지면 마음도 조금은 가벼워지지 않을까요? 🫕",
  "오늘 하루를 잘 버텨낸 당신에게 작은 보상을 드릴게요 🍱",
  "이 음식 한 입으로 피로가 사르르 녹기를 바랍니다 🧂",
  "에너지가 바닥날 땐, 맛있는 음식이 최고의 리필이에요 🥘"]
    return messages[Math.floor(Math.random() * messages.length)]
  }

  // 음식 이미지 URL 가져오기
  useEffect(() => {
    const fetchImage = async () => {
      try {
        setIsLoading(true)

        // 이미 저장된 이미지 URL이 있는지 확인
        if (recommendation.imageUrl) {
          setImageUrl(recommendation.imageUrl)
          setIsLoading(false)
          return
        }

        // 기본 플레이스홀더 이미지 사용 (사용자가 직접 구현할 예정)
        const url = await getFoodImageUrl(recommendation.foodName, recommendation.category)
        setImageUrl(url)

        // 추천 객체에 이미지 URL 저장 (메모리에만 저장됨)
        if (recommendation && typeof recommendation === "object") {
          recommendation.imageUrl = url
        }
      } catch (error) {
        console.error("이미지 가져오기 실패:", error)
        setImageUrl(`/placeholder.svg?height=300&width=600&text=${encodeURIComponent(recommendation.foodName)}`)
      } finally {
        setIsLoading(false)
      }
    }

    fetchImage()
  }, [recommendation])

  // 다시 추천받기 처리
  const handleRefresh = async () => {
    if (!recommendation?.input) return

    setIsRefreshing(true)
    try {
      const newRecommendation = await getNewRecommendation(recommendation.input)
      if (newRecommendation) {
        setRecommendation(newRecommendation)
        // URL 업데이트 (페이지 새로고침 없이)
        router.replace(`/recommendation?id=${newRecommendation.id}`)
      }
    } catch (error) {
      console.error("새로운 추천을 받는데 실패했습니다:", error)
    } finally {
      setIsRefreshing(false)
    }
  }

  // 별점 평가 처리
  const handleRating = async (rating: number, feedback?: string) => {
    if (!recommendation?.id) return

    try {
      await saveRating(recommendation.id, rating, feedback)
    } catch (error) {
      console.error("평가 저장 중 오류 발생:", error)
    }
  }

  // 뒤로가기 처리
  const handleGoBack = () => {
    router.push("/")
  }

  // 기분 아이콘 가져오기
  const getMoodIcon = (moodType: string) => {
    switch (moodType) {
      case "happy":
        return <Smile className={`h-6 w-6 text-yellow-500`} />
      case "sad":
        return <Frown className={`h-6 w-6 text-blue-500`} />
      case "hungry":
        return <Utensils className={`h-6 w-6 text-orange-500`} />
      case "tired":
        return <Coffee className={`h-6 w-6 text-purple-500`} />
      default:
        return <Smile className={`h-6 w-6 text-yellow-500`} />
    }
  }

  // 날씨 아이콘 가져오기
  const getWeatherIcon = (weatherType: string) => {
    switch (weatherType) {
      case "sunny":
        return <Sun className={`h-6 w-6 text-yellow-500`} />
      case "rainy":
        return <CloudRain className={`h-6 w-6 text-blue-500`} />
      case "cloudy":
        return <Cloud className={`h-6 w-6 text-gray-500`} />
      case "cold":
        return <Thermometer className={`h-6 w-6 text-blue-300`} />
      case "hot":
        return <Thermometer className={`h-6 w-6 text-red-500`} />
      case "snow":
        return <Snow className={`h-6 w-6 text-blue-200`} />
      default:
        return <Sun className={`h-6 w-6 text-yellow-500`} />
    }
  }

  // 함께하는 사람 아이콘 가져오기
  const getWithWhomIcon = (withWhomType: string) => {
    switch (withWhomType) {
      case "couple":
        return <Heart className={`h-6 w-6 text-red-500`} />
      case "family":
        return <Home className={`h-6 w-6 text-green-500`} />
      case "friends":
        return <Users className={`h-6 w-6 text-blue-500`} />
      case "alone":
        return <User className={`h-6 w-6 text-purple-500`} />
      default:
        return <User className={`h-6 w-6 text-purple-500`} />
    }
  }

  // 기분과 날씨에 따른 요약 생성
  const getSummary = () => {
    if (!recommendation?.input) return null

    const { mood, weather, withWhom } = recommendation.input
    let moodText = ""
    let weatherText = ""
    let withWhomText = ""

    switch (mood) {
      case "happy":
        moodText = "행복한 기분"
        break
      case "sad":
        moodText = "우울한 기분"
        break
      case "hungry":
        moodText = "배고픈 상태"
        break
      case "tired":
        moodText = "피곤한 상태"
        break
      default:
        moodText = "현재 기분"
    }

    switch (weather) {
      case "sunny":
        weatherText = "맑은 날씨"
        break
      case "rainy":
        weatherText = "비 오는 날씨"
        break
      case "cloudy":
        weatherText = "흐린 날씨"
        break
      case "cold":
        weatherText = "추운 날씨"
        break
      case "hot":
        weatherText = "더운 날씨"
        break
      case "snow":
        weatherText = "눈 오는 날씨"
        break
      default:
        weatherText = "현재 날씨"
    }

    switch (withWhom) {
      case "couple":
        withWhomText = "연인과 함께할 때"
        break
      case "family":
        withWhomText = "가족과 함께할 때"
        break
      case "friends":
        withWhomText = "친구와 함께할 때"
        break
      case "alone":
        withWhomText = "혼자 있을 때"
        break
      default:
        withWhomText = ""
    }

    return `${moodText}과 ${weatherText}에 ${withWhomText} 어울리는 ${recommendation.category} 요리입니다.`
  }

  // 맞춤형 추천 이유 생성
  const getPersonalizedReason = () => {
    if (!recommendation?.input || !recommendation?.reason) return recommendation?.reason

    const { mood, weather, withWhom } = recommendation.input
    let personalizedReason = recommendation.reason

    // 기분에 따른 추가 설명
    if (mood === "happy") {
      personalizedReason += ` 행복한 기분을 더욱 즐겁게 해줄 수 있는 음식이에요.`
    } else if (mood === "sad") {
      personalizedReason += ` 우울한 기분을 달래주고 위로가 될 수 있는 음식이에요.`
    } else if (mood === "tired") {
      personalizedReason += ` 피로를 풀어주고 에너지를 채워줄 수 있는 음식이에요.`
    } else if (mood === "hungry") {
      personalizedReason += ` 허기를 빠르게 채워주고 만족감을 줄 수 있는 음식이에요.`
    }

    // 날씨에 따른 추가 설명
    if (weather === "sunny") {
      personalizedReason += ` 맑은 날씨에 기분 좋게 즐길 수 있어요.`
    } else if (weather === "rainy") {
      personalizedReason += ` 비 오는 날 실내에서 따뜻하게 즐기기 좋아요.`
    } else if (weather === "cloudy") {
      personalizedReason += ` 흐린 날씨에 기분을 밝게 해줄 수 있어요.`
    } else if (weather === "cold") {
      personalizedReason += ` 추운 날씨에 몸을 따뜻하게 해줄 수 있어요.`
    } else if (weather === "hot") {
      personalizedReason += ` 더운 날씨에 입맛을 돋워줄 수 있어요.`
    } else if (weather === "snow") {
      personalizedReason += ` 눈 오는 날 포근한 실내에서 즐기기 좋아요.`
    }

    // 함께하는 사람에 따른 추가 설명
    if (withWhom === "couple") {
      personalizedReason += ` 연인과 함께 특별한 시간을 보내기에 완벽한 선택이에요.`
    } else if (withWhom === "family") {
      personalizedReason += ` 가족과 함께 따뜻한 시간을 보내기에 안성맞춤인 선택이에요.`
    } else if (withWhom === "friends") {
      personalizedReason += ` 친구들과 즐거운 시간을 보내기에 딱 좋은 선택이에요.`
    } else if (withWhom === "alone") {
      personalizedReason += ` 혼자서도 편안하게 즐길 수 있는 좋은 선택이에요.`
    }

    return personalizedReason
  }

  // 알레르기 및 식이 제한 정보 메시지 생성
  const getDietaryMessage = () => {
    if (!recommendation?.input) return null

    const { dietaryPreferences, allergies } = recommendation.input
    const messages = []

    if (dietaryPreferences && dietaryPreferences.length > 0) {
      const preferencesText = dietaryPreferences
        .map((pref: string) => {
          switch (pref) {
            case "vegetarian":
              return "채식"
            case "vegan":
              return "비건"
            case "halal":
              return "할랄"
            case "diet":
              return "다이어트"
            default:
              return pref
          }
        })
        .join(", ")

      messages.push(`${preferencesText} 선호도를 고려했어요`)
    }

    if (allergies && allergies.length > 0) {
      messages.push("알레르기 유발 음식은 제외했어요")
    }

    return messages.length > 0 ? messages : null
  }

  return (
    <div className={`min-h-screen bg-gradient-to-b ${bgColor} transition-colors duration-500`}>
      {/* 배경 일러스트 */}
      <FoodIllustrations accentColor={accentColor} />

      {/* 뒤로가기 버튼 */}
      <Button
        onClick={handleGoBack}
        variant="ghost"
        className="absolute top-4 left-4 z-50 rounded-full p-2 bg-white/50 backdrop-blur-sm hover:bg-white/70"
      >
        <ArrowLeft className="h-6 w-6" style={{ color: accentColor }} />
        <span className="sr-only">뒤로가기</span>
      </Button>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-lg overflow-hidden bg-white/30 backdrop-blur-md border-white/20">
            {/* 투명한 헤더 - '냠냠봇의 추천 음식!' 텍스트 제거 */}
            <div className="relative">
              {isLoading ? (
                <div className="w-full h-[300px] flex items-center justify-center bg-gray-100/50 backdrop-blur-sm">
                  <Loader2 className="h-8 w-8 animate-spin" style={{ color: accentColor }} />
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={
                      imageUrl ||
                      `/placeholder.svg?height=300&width=600&text=${encodeURIComponent(recommendation.foodName) || "/placeholder.svg"}`
                    }
                    alt={recommendation.foodName}
                    className="w-full h-[300px] object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                    <h2 className="text-4xl font-bold text-white mb-2">{recommendation.foodName}</h2>
                    <div
                      className="inline-block px-3 py-1 rounded-full text-sm text-white"
                      style={{ backgroundColor: accentColor }}
                    >
                      {recommendation.category}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <CardContent className="p-6">
              <div className="space-y-4">
                {/* 버튼 섹션 - 추천 히스토리 버튼 추가 및 위치 변경 */}
                <div className="flex justify-between items-center">
                  <Button
                    variant="outline"
                    className="gap-2 rounded-full"
                    onClick={() => setHistoryOpen(!historyOpen)}
                    style={{ borderColor: `${accentColor}80`, color: accentColor }}
                  >
                    <Clock className="h-5 w-5" />
                    추천 히스토리
                  </Button>
                  <Button
                    variant="outline"
                    className="gap-2 rounded-full"
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    style={{ borderColor: accentColor, color: accentColor, fontWeight: "bold" }}
                  >
                    {isRefreshing ? <Loader2 className="h-5 w-5 animate-spin" /> : <RefreshCw className="h-5 w-5" />}
                    다시 추천받기
                  </Button>
                </div>

                {/* 히스토리가 열려있을 때만 표시 */}
                {historyOpen && (
                  <div className="mt-4">
                    <PreviousRecommendationsList
                      accentColor={accentColor}
                      variant="collapsible"
                      onToggle={(open) => setHistoryOpen(open)}
                    />
                  </div>
                )}

                {/* 통합된 분석 카드 */}
                {recommendation?.input && (
                  <Card
                    className="border-2 rounded-xl overflow-hidden shadow-md bg-white/50 backdrop-blur-sm"
                    style={{ borderColor: `${accentColor}40` }}
                  >
                    <CardContent className="p-4 space-y-4">
                      {/* 감성 메시지 */}
                      <div className="text-center p-3 rounded-lg italic text-gray-700 font-medium">
                        {emotionalMessage}
                      </div>

                      {/* 추천 요약 */}
                      <div
                        className="bg-white/70 backdrop-blur-sm p-4 rounded-lg shadow-sm border-l-4"
                        style={{ borderColor: accentColor }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          {getMoodIcon(recommendation.input.mood)}
                          {getWeatherIcon(recommendation.input.weather)}
                          {recommendation.input.withWhom && getWithWhomIcon(recommendation.input.withWhom)}
                          <h3 className="font-medium" style={{ color: accentColor }}>
                            추천 요약
                          </h3>
                        </div>
                        <p className="text-gray-700">{getSummary()}</p>
                      </div>

                      {/* 맞춤형 추천 이유 */}
                      <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg shadow-sm">
                        <h3 className="font-medium mb-2" style={{ color: accentColor }}>
                          추천 이유
                        </h3>
                        <p className="text-gray-700">{getPersonalizedReason()}</p>
                      </div>

                      {/* 알레르기 및 식이 제한 정보 */}
                      {getDietaryMessage() && (
                        <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg shadow-sm">
                          <div className="flex flex-col gap-2">
                            <h3 className="font-medium flex items-center gap-2" style={{ color: accentColor }}>
                              <CheckCircle2 className="h-5 w-5" />
                              맞춤형 추천 정보
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {getDietaryMessage()?.map((message, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 rounded-full text-sm flex items-center gap-1"
                                  style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
                                >
                                  <CheckCircle2 className="h-4 w-4" />
                                  {message}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {recommendation.ingredients && (
                  <div className="bg-white/50 backdrop-blur-sm p-4 rounded-xl shadow-sm">
                    <h3 className="font-medium mb-2" style={{ color: accentColor }}>
                      주요 재료
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {recommendation.ingredients.map((ingredient: string, index: number) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 rounded-full text-sm font-medium"
                          style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
                        >
                          {ingredient}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* 공유하기/배달/지도 버튼 섹션 */}
                <div className="flex justify-between items-center gap-3 py-2">
                  <div>
                    <SocialShare foodName={recommendation.foodName} accentColor="#232323" textColor="#ffffff" />
                  </div>
                  <div className="flex gap-3">
                    <DeliveryAppButtons foodName={recommendation.foodName} accentColor="#232323" textColor="#ffffff" />
                    <MapAppButtons foodName={recommendation.foodName} accentColor="#232323" textColor="#ffffff" />
                  </div>
                </div>

                {/* 별점 평가 */}
                <div className="bg-white/50 backdrop-blur-sm p-4 rounded-xl shadow-sm mt-6">
                  <StarRating onRating={handleRating} accentColor={accentColor} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
