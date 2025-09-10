"use client"

import { Facebook, Instagram, MessageCircle, Share2, Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface SocialShareProps {
  foodName: string
  accentColor?: string
  textColor?: string
}

export function SocialShare({ foodName, accentColor = "#ECECEC", textColor = "#000000" }: SocialShareProps) {
  const shareText = `냠냠봇이 추천해준 오늘의 음식: ${foodName} 🍽️ #냠냠봇 #음식추천`
  const shareUrl = typeof window !== "undefined" ? window.location.href : ""

  const handleShare = (platform: string) => {
    let shareUrl = ""

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          window.location.href,
        )}&quote=${encodeURIComponent(shareText)}`
        break
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          shareText,
        )}&url=${encodeURIComponent(window.location.href)}`
        break
      case "instagram":
        // 인스타그램은 직접 공유 API가 없어 클립보드에 복사하는 방식으로 대체
        navigator.clipboard.writeText(`${shareText} ${window.location.href}`)
        alert("텍스트가 클립보드에 복사되었습니다. 인스타그램에 붙여넣기 해주세요.")
        return
      case "message":
        // 모바일 기기에서 SMS 앱 열기
        shareUrl = `sms:?&body=${encodeURIComponent(`${shareText} ${window.location.href}`)}`
        break
      case "kakao":
        // 카카오톡 공유 API 사용 (실제로는 Kakao SDK 초기화 필요)
        if (window.Kakao && window.Kakao.Share) {
          window.Kakao.Share.sendDefault({
            objectType: "feed",
            content: {
              title: "냠냠봇 음식 추천",
              description: shareText,
              imageUrl: "https://example.com/food-image.jpg", // 실제 음식 이미지 URL로 대체 필요
              link: {
                mobileWebUrl: window.location.href,
                webUrl: window.location.href,
              },
            },
            buttons: [
              {
                title: "웹으로 보기",
                link: {
                  mobileWebUrl: window.location.href,
                  webUrl: window.location.href,
                },
              },
            ],
          })
          return
        } else {
          // Kakao SDK가 없는 경우 클립보드에 복사
          navigator.clipboard.writeText(`${shareText} ${window.location.href}`)
          alert("텍스트가 클립보드에 복사되었습니다. 카카오톡에 붙여넣기 해주세요.")
          return
        }
      default:
        // 기본 공유 API 사용 (모바일에서만 작동)
        if (navigator.share) {
          navigator
            .share({
              title: "냠냠봇 음식 추천",
              text: shareText,
              url: window.location.href,
            })
            .catch((error) => console.log("공유 실패:", error))
          return
        } else {
          // 공유 API를 지원하지 않는 경우 클립보드에 복사
          navigator.clipboard.writeText(`${shareText} ${window.location.href}`)
          alert("텍스트가 클립보드에 복사되었습니다.")
          return
        }
    }

    // 새 창에서 공유 URL 열기
    window.open(shareUrl, "_blank", "noopener,noreferrer")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="default"
          className="gap-2 rounded-full transition-colors hover:bg-gray-800"
          style={{ backgroundColor: accentColor, color: textColor }}
        >
          <Share2 className="h-5 w-5" />
          공유하기
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleShare("kakao")}>
          <span className="bg-yellow-400 text-black rounded-full p-1 mr-2">
            <span className="font-bold text-xs">K</span>
          </span>
          카카오톡
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare("message")}>
          <MessageCircle className="h-5 w-5 mr-2 text-green-500" />
          메시지
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare("instagram")}>
          <Instagram className="h-5 w-5 mr-2 text-pink-500" />
          인스타그램
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare("facebook")}>
          <Facebook className="h-5 w-5 mr-2 text-blue-600" />
          페이스북
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare("twitter")}>
          <Twitter className="h-5 w-5 mr-2 text-blue-400" />X (트위터)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
