"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Cloud,
  CloudRain,
  Sun,
  Thermometer,
  Loader2,
  Smile,
  Frown,
  Coffee,
  Utensils,
  CloudSnowIcon as Snow,
  Users,
  Heart,
  Home,
  User,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { FloatingButton } from "@/components/floating-button"
import { FoodIllustrations } from "@/components/food-illustrations"
import { getRecommendation } from "@/actions/food-recommendation"

type Mood = "happy" | "sad" | "hungry" | "tired"
type Weather = "sunny" | "rainy" | "cloudy" | "cold" | "hot" | "snow"
type WithWhom = "couple" | "family" | "friends" | "alone"

export function FoodRecommendationForm() {
  const router = useRouter()
  const [mood, setMood] = useState<Mood>("hungry")
  const [weather, setWeather] = useState<Weather>("sunny")
  const [withWhom, setWithWhom] = useState<WithWhom>("alone")
  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>([])
  const [allergies, setAllergies] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [bgColor, setBgColor] = useState<string>("from-[#FFE1C6] to-[#FFCBA4]")
  const [accentColor, setAccentColor] = useState<string>("#FF6B35")
  const [moodMessage, setMoodMessage] = useState<string>("")
  const [isDietaryOpen, setIsDietaryOpen] = useState(false)
  const [isAllergiesOpen, setIsAllergiesOpen] = useState(false)

  // 페이지 로딩 최적화
  useEffect(() => {
    // 컴포넌트 마운트 시 로딩 상태 해제
    setIsLoading(false)
  }, [])

  // 기분과 날씨에 따른 배경색 및 액센트 색상 설정
  useEffect(() => {
    if (mood === "happy") {
      setBgColor("from-[#FFF8E1] to-[#FFECB3]") // 밝은 노란색 계열
      setAccentColor("#FFB300") // 밝은 노란색 액센트
      setMoodMessage("행복한 기분에 어울리는 음식을 찾아볼게요!")
    } else if (mood === "sad") {
      setBgColor("from-[#E3F2FD] to-[#BBDEFB]") // 어두운 파란색 계열
      setAccentColor("#1E88E5") // 파란색 액센트
      setMoodMessage("우울한 기분을 달래줄 포근한 음식을 추천해 드릴게요")
    } else if (mood === "tired") {
      setBgColor("from-[#E8EAF6] to-[#C5CAE9]") // 연보라색 계열
      setAccentColor("#5C6BC0") // 보라색 액센트
      setMoodMessage("피곤한 당신에게 활력을 줄 멋진 음식을 찾아볼게요")
    } else if (mood === "hungry") {
      setBgColor("from-[#FBE9E7] to-[#FFCCBC]") // 연주황색 계열
      setAccentColor("#FF7043") // 주황색 액센트
      setMoodMessage("배고픔을 달래줄 기깔난 음식을 추천해 드릴게요")
    } else if (weather === "sunny") {
      setBgColor("from-[#FFF8E1] to-[#FFECB3]") // 밝은 노란색 계열
      setAccentColor("#FFB300") // 밝은 노란색 액센트
    } else if (weather === "rainy") {
      setBgColor("from-[#E3F2FD] to-[#BBDEFB]") // 어두운 파란색 계열
      setAccentColor("#1E88E5") // 파란색 액센트
    } else {
      setBgColor("from-[#FFE1C6] to-[#FFCBA4]") // 기본 배경색
      setAccentColor("#FF6B35") // 기본 액센트 색상
    }
  }, [mood, weather])

  const handleDietaryPreferenceChange = (preference: string) => {
    setDietaryPreferences((prev) => {
      if (prev.includes(preference)) {
        return prev.filter((p) => p !== preference)
      } else {
        return [...prev, preference]
      }
    })
  }

  const handleAllergyChange = (allergy: string) => {
    setAllergies((prev) => {
      if (prev.includes(allergy)) {
        return prev.filter((a) => a !== allergy)
      } else {
        return [...prev, allergy]
      }
    })
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // 서버 액션 호출 시 날씨 정보도 함께 전달
      const recommendation = await getRecommendation({
        mood,
        weather,
        dietaryPreferences,
        withWhom,
        allergies,
      })

      // 추천 결과가 있으면 바로 페이지 이동
      if (recommendation && recommendation.id) {
        router.push(`/recommendation?id=${recommendation.id}`)
      } else {
        throw new Error("추천을 받는데 실패했습니다.")
      }
    } catch (error) {
      console.error("음식 추천 중 오류가 발생했습니다:", error)
      setError("음식 추천 중 오류가 발생했습니다. 다시 시도해 주세요.")
      setIsSubmitting(false)
    }
  }

  const getMoodIcon = (moodType: Mood) => {
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

  const getWeatherIcon = (weatherType: Weather) => {
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

  const getWithWhomIcon = (withWhomType: WithWhom) => {
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

  const moodOptions: { value: Mood; label: string }[] = [
    { value: "happy", label: "행복해요" },
    { value: "sad", label: "우울해요" },
    { value: "hungry", label: "배고파요" },
    { value: "tired", label: "피곤해요" },
  ]

  const weatherOptions: { value: Weather; label: string }[] = [
    { value: "sunny", label: "맑음" },
    { value: "rainy", label: "비" },
    { value: "cloudy", label: "흐림" },
    { value: "cold", label: "추움" },
    { value: "hot", label: "더움" },
    { value: "snow", label: "눈" },
  ]

  const withWhomOptions: { value: WithWhom; label: string }[] = [
    { value: "couple", label: "연인과 함께" },
    { value: "family", label: "가족과 함께" },
    { value: "friends", label: "친구와 함께" },
    { value: "alone", label: "나와 함께" },
  ]

  const allergyOptions: { value: string; label: string }[] = [
    { value: "dairy", label: "유제품 알레르기" },
    { value: "egg", label: "달걀 알레르기" },
    { value: "nuts", label: "견과류 알레르기" },
    { value: "soy", label: "콩 알레르기" },
    { value: "wheat", label: "밀 알레르기" },
    { value: "seafood", label: "생선 및 조개류 알레르기" },
  ]

  if (isLoading) {
    return (
      <Card className="shadow-lg bg-white/30 backdrop-blur-md border-white/20">
        <CardContent className="p-6 flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" style={{ color: accentColor }} />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={`min-h-screen bg-gradient-to-b ${bgColor} transition-colors duration-500 pb-24`}>
      {/* 배경 일러스트 */}
      <FoodIllustrations accentColor={accentColor} />

      {/* 헤더 섹션 */}
      <header className="relative z-10 pt-8 pb-4">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-3" style={{ color: accentColor }}>
            냠냠봇
          </h1>
          <p className="text-xl font-medium text-[#994D25] mb-2">선택이 힘든 당신을 위한 오늘의 맛있는 선택</p>
          {moodMessage && (
            <p className="text-base italic" style={{ color: accentColor }}>
              {moodMessage}
            </p>
          )}
        </div>
      </header>

      {/* 메인 컨텐츠 섹션 */}
      <main className="relative z-10 px-4 pb-8">
        <div className="container mx-auto max-w-7xl">
          <Card className="shadow-2xl bg-white/90 backdrop-blur-lg border-white/30">
            <CardHeader className="text-center text-white py-6" style={{ backgroundColor: `${accentColor}DD` }}>
              <CardTitle className="text-2xl font-bold">오늘의 음식 추천받기</CardTitle>
              <CardDescription className="text-white/90 text-lg">맛있는 음식을 추천해 드릴게요</CardDescription>
            </CardHeader>
            
            <CardContent className="p-6">
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* 기본 정보 - 컴팩트한 수평 레이아웃 */}
                <div className="grid lg:grid-cols-3 gap-8">
                  {/* 무드 섹션 */}
                  <div className="space-y-4">
                    <div className="text-center">
                      <Label className="text-lg font-semibold flex items-center justify-center gap-2" style={{ color: accentColor }}>
                        😊 오늘의 무드
                      </Label>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {moodOptions.map((option) => (
                        <div
                          key={option.value}
                          className={`relative rounded-xl border-2 p-3 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                            mood === option.value
                              ? "border-current shadow-lg scale-105"
                              : "border-gray-200 hover:border-gray-300"
                          } bg-white`}
                          style={{
                            borderColor: mood === option.value ? accentColor : undefined,
                            backgroundColor: mood === option.value ? `${accentColor}15` : undefined,
                          }}
                          onClick={() => setMood(option.value)}
                        >
                          <div className="flex flex-col items-center justify-center h-16">
                            <div className="mb-2">{getMoodIcon(option.value)}</div>
                            <span className="text-center text-xs font-semibold">{option.label}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 날씨 섹션 */}
                  <div className="space-y-4">
                    <div className="text-center">
                      <Label className="text-lg font-semibold flex items-center justify-center gap-2" style={{ color: accentColor }}>
                        🌤️ 오늘의 날씨
                      </Label>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {weatherOptions.map((option) => (
                        <div
                          key={option.value}
                          className={`relative rounded-xl border-2 p-3 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                            weather === option.value
                              ? "border-current shadow-lg scale-105"
                              : "border-gray-200 hover:border-gray-300"
                          } bg-white`}
                          style={{
                            borderColor: weather === option.value ? accentColor : undefined,
                            backgroundColor: weather === option.value ? `${accentColor}15` : undefined,
                          }}
                          onClick={() => setWeather(option.value)}
                        >
                          <div className="flex flex-col items-center justify-center h-16">
                            <div className="mb-2">{getWeatherIcon(option.value)}</div>
                            <span className="text-center text-xs font-semibold">{option.label}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 동행자 섹션 */}
                  <div className="space-y-4">
                    <div className="text-center">
                      <Label className="text-lg font-semibold flex items-center justify-center gap-2" style={{ color: accentColor }}>
                        👥 누구와 함께
                      </Label>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {withWhomOptions.map((option) => (
                        <div
                          key={option.value}
                          className={`relative rounded-xl border-2 p-3 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                            withWhom === option.value
                              ? "border-current shadow-lg scale-105"
                              : "border-gray-200 hover:border-gray-300"
                          } bg-white`}
                          style={{
                            borderColor: withWhom === option.value ? accentColor : undefined,
                            backgroundColor: withWhom === option.value ? `${accentColor}15` : undefined,
                          }}
                          onClick={() => setWithWhom(option.value)}
                        >
                          <div className="flex flex-col items-center justify-center h-16">
                            <div className="mb-2">{getWithWhomIcon(option.value)}</div>
                            <span className="text-center text-xs font-semibold">{option.label}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 구분선 */}
                <div className="flex items-center justify-center my-8">
                  <div className="h-px bg-gray-300 flex-1"></div>
                  <div className="px-4 text-gray-500 font-medium">추가 옵션</div>
                  <div className="h-px bg-gray-300 flex-1"></div>
                </div>

                {/* 추가 정보 - 수평 레이아웃 */}
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* 식이 제한 및 선호도 */}
                  <Collapsible
                    open={isDietaryOpen}
                    onOpenChange={setIsDietaryOpen}
                    className="border-2 border-gray-200 rounded-2xl overflow-hidden bg-white shadow-md h-fit"
                  >
                    <CollapsibleTrigger
                      className="flex w-full items-center justify-between p-4 font-semibold hover:bg-gray-50 transition-colors"
                      style={{ color: accentColor }}
                    >
                      <span className="text-base flex items-center gap-2">
                        <span className="text-lg">🥗</span> 식이 제한 및 선호도
                      </span>
                      {isDietaryOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="border-t-2 border-gray-100">
                      <div className="p-4">
                        <p className="text-sm text-gray-600 mb-3">해당 정보를 고려하여 음식을 추천해 드립니다</p>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50">
                            <Checkbox
                              id="vegetarian"
                              className="h-4 w-4"
                              checked={dietaryPreferences.includes("vegetarian")}
                              onCheckedChange={() => handleDietaryPreferenceChange("vegetarian")}
                              style={{
                                borderColor: dietaryPreferences.includes("vegetarian") ? accentColor : undefined,
                                backgroundColor: dietaryPreferences.includes("vegetarian") ? accentColor : undefined,
                              }}
                            />
                            <Label htmlFor="vegetarian" className="text-sm font-medium cursor-pointer">
                              채식주의
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50">
                            <Checkbox
                              id="vegan"
                              className="h-4 w-4"
                              checked={dietaryPreferences.includes("vegan")}
                              onCheckedChange={() => handleDietaryPreferenceChange("vegan")}
                              style={{
                                borderColor: dietaryPreferences.includes("vegan") ? accentColor : undefined,
                                backgroundColor: dietaryPreferences.includes("vegan") ? accentColor : undefined,
                              }}
                            />
                            <Label htmlFor="vegan" className="text-sm font-medium cursor-pointer">
                              비건
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50">
                            <Checkbox
                              id="halal"
                              className="h-4 w-4"
                              checked={dietaryPreferences.includes("halal")}
                              onCheckedChange={() => handleDietaryPreferenceChange("halal")}
                              style={{
                                borderColor: dietaryPreferences.includes("halal") ? accentColor : undefined,
                                backgroundColor: dietaryPreferences.includes("halal") ? accentColor : undefined,
                              }}
                            />
                            <Label htmlFor="halal" className="text-sm font-medium cursor-pointer">
                              할랄
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50">
                            <Checkbox
                              id="diet"
                              className="h-4 w-4"
                              checked={dietaryPreferences.includes("diet")}
                              onCheckedChange={() => handleDietaryPreferenceChange("diet")}
                              style={{
                                borderColor: dietaryPreferences.includes("diet") ? accentColor : undefined,
                                backgroundColor: dietaryPreferences.includes("diet") ? accentColor : undefined,
                              }}
                            />
                            <Label htmlFor="diet" className="text-sm font-medium cursor-pointer">
                              다이어트 중
                            </Label>
                          </div>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  {/* 알레르기 */}
                  <Collapsible
                    open={isAllergiesOpen}
                    onOpenChange={setIsAllergiesOpen}
                    className="border-2 border-amber-200 rounded-2xl overflow-hidden bg-amber-50 shadow-md h-fit"
                  >
                    <CollapsibleTrigger
                      className="flex w-full items-center justify-between p-4 font-semibold hover:bg-amber-100 transition-colors"
                      style={{ color: accentColor }}
                    >
                      <span className="flex items-center gap-2 text-base">
                        <AlertTriangle className="h-5 w-5 text-amber-600" />
                        ⚠️ 알레르기 정보
                      </span>
                      {isAllergiesOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="border-t-2 border-amber-200">
                      <div className="p-4">
                        <p className="text-sm text-amber-700 mb-3 font-medium">⚠️ 알레르기가 있는 음식은 추천에서 완전히 제외됩니다</p>
                        <div className="grid grid-cols-1 gap-2">
                          {allergyOptions.map((option) => (
                            <div key={option.value} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-amber-100">
                              <Checkbox
                                id={option.value}
                                className="h-4 w-4"
                                checked={allergies.includes(option.value)}
                                onCheckedChange={() => handleAllergyChange(option.value)}
                                style={{
                                  borderColor: allergies.includes(option.value) ? accentColor : undefined,
                                  backgroundColor: allergies.includes(option.value) ? accentColor : undefined,
                                }}
                              />
                              <Label htmlFor={option.value} className="text-sm font-medium cursor-pointer">
                                {option.label}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* 플로팅 버튼 */}
      <FloatingButton onClick={handleSubmit} isLoading={isSubmitting} accentColor={accentColor}>
        🍽️ 음식 추천받기
      </FloatingButton>
    </div>
  )
}