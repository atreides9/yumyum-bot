"use client"

import { MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { getMapAppUrl } from "@/utils/food-image"

interface MapAppButtonsProps {
  foodName: string
  accentColor?: string
  textColor?: string
}

export function MapAppButtons({ foodName, accentColor = "#FF6B35", textColor = "#000000" }: MapAppButtonsProps) {
  const handleOpenMap = (mapType: "naver" | "kakao" | "google") => {
    const url = getMapAppUrl(foodName, mapType)
    window.open(url, "_blank")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="default"
          className="gap-2 rounded-full transition-colors hover:bg-gray-800"
          style={{ backgroundColor: accentColor, color: textColor }}
        >
          <MapPin className="h-5 w-5" />
          지도에서 찾기
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleOpenMap("naver")}>네이버 지도</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleOpenMap("kakao")}>카카오 지도</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleOpenMap("google")}>구글 지도</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
