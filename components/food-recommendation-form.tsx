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

      <div className="container mx-auto px-4 py-8 relative z-10">
        <header className="mb-8 text-center relative">
          <h1 className="text-4xl font-bold mb-2" style={{ color: accentColor }}>
            냠냠봇
          </h1>
          <p className="text-lg font-medium text-[#994D25]">선택이 힘든 당신을 위한 오늘의 맛있는 선택</p>
          {moodMessage && (
            <p className="mt-2 text-sm italic" style={{ color: accentColor }}>
              {moodMessage}
            </p>
          )}
        </header>

        <div className="max-w-2xl mx-auto">
          <Card className="shadow-lg bg-white/30 backdrop-blur-md border-white/20">
            <CardHeader className="rounded-t-lg text-center text-white" style={{ backgroundColor: `${accentColor}CC` }}>
              <CardTitle>오늘의 음식 추천받기</CardTitle>
              <CardDescription className="text-white/80">맛있는 음식을 추천해 드릴게요</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {error && (
                <div className="mb-4 p-3 bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-md text-red-800">
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="space-y-8">
                  <div className="space-y-2">
                    <Label htmlFor="mood" className="text-lg font-medium" style={{ color: accentColor }}>
                      오늘의 무드
                    </Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {moodOptions.map((option) => (
                        <div
                          key={option.value}
                          className={`relative rounded-xl border-2 p-3 cursor-pointer transition-all hover:shadow-md ${
                            mood === option.value
                              ? "border-current bg-opacity-10"
                              : "border-white/40 hover:border-white/60"
                          } bg-white/40 backdrop-blur-sm`}
                          style={{
                            borderColor: mood === option.value ? accentColor : undefined,
                            backgroundColor: mood === option.value ? `${accentColor}20` : undefined,
                          }}
                          onClick={() => setMood(option.value)}
                        >
                          <div className="flex flex-col items-center justify-center h-14">
                            <div className="mb-2">{getMoodIcon(option.value)}</div>
                            <span className="text-center text-sm font-medium">{option.label}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label className="text-lg font-medium" style={{ color: accentColor }}>
                        오늘의 날씨
                      </Label>
                    </div>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                      {weatherOptions.map((option) => (
                        <div
                          key={option.value}
                          className={`relative rounded-xl border-2 p-3 cursor-pointer transition-all hover:shadow-md ${
                            weather === option.value
                              ? "border-current bg-opacity-10"
                              : "border-white/40 hover:border-white/60"
                          } bg-white/40 backdrop-blur-sm`}
                          style={{
                            borderColor: weather === option.value ? accentColor : undefined,
                            backgroundColor: weather === option.value ? `${accentColor}20` : undefined,
                          }}
                          onClick={() => setWeather(option.value)}
                        >
                          <div className="flex flex-col items-center justify-center h-14">
                            <div className="mb-2">{getWeatherIcon(option.value)}</div>
                            <span className="text-center text-sm font-medium">{option.label}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label className="text-lg font-medium" style={{ color: accentColor }}>
                        누구와 함께
                      </Label>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {withWhomOptions.map((option) => (
                        <div
                          key={option.value}
                          className={`relative rounded-xl border-2 p-3 cursor-pointer transition-all hover:shadow-md ${
                            withWhom === option.value
                              ? "border-current bg-opacity-10"
                              : "border-white/40 hover:border-white/60"
                          } bg-white/40 backdrop-blur-sm`}
                          style={{
                            borderColor: withWhom === option.value ? accentColor : undefined,
                            backgroundColor: withWhom === option.value ? `${accentColor}20` : undefined,
                          }}
                          onClick={() => setWithWhom(option.value)}
                        >
                          <div className="flex flex-col items-center justify-center h-14">
                            <div className="mb-2">{getWithWhomIcon(option.value)}</div>
                            <span className="text-center text-sm font-medium">{option.label}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 식이 제한 및 선호도 - 접을 수 있게 변경 */}
                  <Collapsible
                    open={isDietaryOpen}
                    onOpenChange={setIsDietaryOpen}
                    className="border border-white/40 rounded-xl overflow-hidden bg-white/40 backdrop-blur-sm"
                  >
                    <CollapsibleTrigger
                      className="flex w-full items-center justify-between p-4 font-medium"
                      style={{ color: accentColor }}
                    >
                      <span className="text-lg">식이 제한 및 선호도</span>
                      {isDietaryOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="p-4 pt-0 border-t border-white/40">
                      <p className="text-xs text-gray-600 mb-3 pt-0">*해당 정보를 고려하여 음식을 추천해 드립니다</p>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            id="vegetarian"
                            className="h-5 w-5"
                            checked={dietaryPreferences.includes("vegetarian")}
                            onCheckedChange={() => handleDietaryPreferenceChange("vegetarian")}
                            style={{
                              borderColor: dietaryPreferences.includes("vegetarian") ? accentColor : undefined,
                              backgroundColor: dietaryPreferences.includes("vegetarian") ? accentColor : undefined,
                            }}
                          />
                          <Label htmlFor="vegetarian" className="text-base">
                            채식
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            id="vegan"
                            className="h-5 w-5"
                            checked={dietaryPreferences.includes("vegan")}
                            onCheckedChange={() => handleDietaryPreferenceChange("vegan")}
                            style={{
                              borderColor: dietaryPreferences.includes("vegan") ? accentColor : undefined,
                              backgroundColor: dietaryPreferences.includes("vegan") ? accentColor : undefined,
                            }}
                          />
                          <Label htmlFor="vegan" className="text-base">
                            비건
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            id="halal"
                            className="h-5 w-5"
                            checked={dietaryPreferences.includes("halal")}
                            onCheckedChange={() => handleDietaryPreferenceChange("halal")}
                            style={{
                              borderColor: dietaryPreferences.includes("halal") ? accentColor : undefined,
                              backgroundColor: dietaryPreferences.includes("halal") ? accentColor : undefined,
                            }}
                          />
                          <Label htmlFor="halal" className="text-base">
                            할랄
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            id="diet"
                            className="h-5 w-5"
                            checked={dietaryPreferences.includes("diet")}
                            onCheckedChange={() => handleDietaryPreferenceChange("diet")}
                            style={{
                              borderColor: dietaryPreferences.includes("diet") ? accentColor : undefined,
                              backgroundColor: dietaryPreferences.includes("diet") ? accentColor : undefined,
                            }}
                          />
                          <Label htmlFor="diet" className="text-base">
                            다이어트 중
                          </Label>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  {/* 알레르기 - 접을 수 있게 변경 */}
                  <Collapsible
                    open={isAllergiesOpen}
                    onOpenChange={setIsAllergiesOpen}
                    className="border border-white/40 rounded-xl overflow-hidden bg-white/40 backdrop-blur-sm"
                  >
                    <CollapsibleTrigger
                      className="flex w-full items-center justify-between p-4 font-medium"
                      style={{ color: accentColor }}
                    >
                      <span className="flex items-center gap-2 text-lg">
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                        알레르기
                      </span>
                      {isAllergiesOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="p-4 pt-0 border-t border-white/40">
                      <p className="text-xs text-gray-600 mb-3 pt-0">*알레르기가 있는 음식은 추천에서 제외됩니다</p>
                      <div className="grid grid-cols-2 gap-3">
                        {allergyOptions.map((option) => (
                          <div key={option.value} className="flex items-center space-x-3">
                            <Checkbox
                              id={option.value}
                              className="h-5 w-5"
                              checked={allergies.includes(option.value)}
                              onCheckedChange={() => handleAllergyChange(option.value)}
                              style={{
                                borderColor: allergies.includes(option.value) ? accentColor : undefined,
                                backgroundColor: allergies.includes(option.value) ? accentColor : undefined,
                              }}
                            />
                            <Label htmlFor={option.value} className="text-base">
                              {option.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 플로팅 버튼 */}
      <FloatingButton onClick={handleSubmit} isLoading={isSubmitting} accentColor={accentColor}>
        음식 추천받기
      </FloatingButton>
    </div>
  )
}
