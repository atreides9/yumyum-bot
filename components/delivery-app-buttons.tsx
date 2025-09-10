"use client"

import { ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface DeliveryAppButtonsProps {
  foodName: string
  accentColor?: string
  textColor?: string
}

export function DeliveryAppButtons({
  foodName,
  accentColor = "#ECECEC",
  textColor = "#000000",
}: DeliveryAppButtonsProps) {
  const handleOpenDeliveryApp = (appType: "baemin" | "coupang" | "yogiyo") => {
    const query = encodeURIComponent(foodName)

    // 모바일 앱 URL 스킴 (음식 검색 결과 페이지로 직접 이동)
    const appUrls: Record<string, string> = {
      baemin: `baemin://search?keyword=${query}`,
      coupang: `coupangeats://search?keyword=${query}`,
      yogiyo: `yogiyoapp://search?keyword=${query}`,
    }

    // 웹 URL (앱이 없을 경우 대체)
    const webUrls: Record<string, string> = {
      baemin: `https://m.baemin.com/search/searchResult?query=${query}`,
      coupang: `https://www.coupangeats.com/search?keyword=${query}`,
      yogiyo: `https://yogiyo.co.kr/mobile/#/search?keyword=${query}`,
    }

    // 앱 스토어 URL
    const storeUrls: Record<string, { android: string; ios: string }> = {
      baemin: {
        android: "https://play.google.com/store/apps/details?id=com.sampleapp",
        ios: "https://apps.apple.com/kr/app/id378084485",
      },
      coupang: {
        android: "https://play.google.com/store/apps/details?id=com.coupang.mobile.eats",
        ios: "https://apps.apple.com/kr/app/id1445504255",
      },
      yogiyo: {
        android: "https://play.google.com/store/apps/details?id=com.fineapp.yogiyo",
        ios: "https://apps.apple.com/kr/app/id463497864",
      },
    }

    // 앱 URL로 직접 이동 시도 (브라우저가 자동으로 앱 열기 확인 대화상자를 표시)
    const appUrl = appUrls[appType]
    const webUrl = webUrls[appType]

    // 앱 실행 시도 후 일정 시간 후에 앱이 실행되지 않으면 웹으로 리디렉션
    const now = Date.now()
    const timeoutDuration = 3000 // 2초

    // 앱 실행 시도
    window.location.href = appUrl

    // 앱 실행 실패 시 웹으로 리디렉션
    setTimeout(() => {
      if (Date.now() - now < timeoutDuration + 100) {
        // 앱이 실행되지 않은 경우 (시간 차이가 적음)
        const isAndroid = /android/i.test(navigator.userAgent)
        const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent)

        if (isAndroid || isIOS) {
          // 모바일 기기인 경우 앱 스토어로 이동
          const storeUrl = isAndroid ? storeUrls[appType].android : storeUrls[appType].ios
          window.location.href = storeUrl
        } else {
          // 데스크톱인 경우 웹사이트로 이동
          window.location.href = webUrl
        }
      }
    }, timeoutDuration)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="default"
          className="gap-2 rounded-full transition-colors hover:bg-gray-800"
          style={{ backgroundColor: accentColor, color: textColor }}
        >
          <ShoppingBag className="h-5 w-5" />
          배달 주문
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleOpenDeliveryApp("baemin")}>배달의 민족</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleOpenDeliveryApp("coupang")}>쿠팡이츠</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleOpenDeliveryApp("yogiyo")}>요기요</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
