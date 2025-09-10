"use client"

import type React from "react"

import { useState } from "react"
import { Send, Star } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

interface StarRatingProps {
  onRating: (rating: number, feedback?: string) => void
  accentColor?: string
}

export function StarRating({ onRating, accentColor = "#FF6B35" }: StarRatingProps) {
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [feedback, setFeedback] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [isSent, setIsSent] = useState(false)

  const handleClick = (index: number) => {
    setRating(index)
    // 별점만 먼저 저장하고, 피드백은 보내기 버튼 클릭 시 저장
    onRating(index, feedback)
  }

  const handleFeedbackChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFeedback(e.target.value)
  }

  const handleSendFeedback = () => {
    if (rating > 0) {
      setIsSending(true)
      // 별점과 피드백 함께 저장
      onRating(rating, feedback)

      // 성공 상태 표시
      setTimeout(() => {
        setIsSending(false)
        setIsSent(true)

        // 3초 후 성공 메시지 숨기기
        setTimeout(() => {
          setIsSent(false)
        }, 3000)
      }, 500)
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-center font-medium text-lg" style={{ color: accentColor }}>
        추천이 마음에 드셨나요 :)
      </p>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((index) => (
          <button
            key={index}
            type="button"
            className="transition-transform hover:scale-110 focus:outline-none"
            onClick={() => handleClick(index)}
            onMouseEnter={() => setHover(index)}
            onMouseLeave={() => setHover(0)}
          >
            <Star
              className="h-10 w-10 md:h-12 md:w-12" // 모바일에서도 잘 보이도록 크기 증가
              fill={index <= (hover || rating) ? accentColor : "transparent"}
              stroke={accentColor}
              strokeWidth={1.5}
            />
          </button>
        ))}
      </div>
      {rating > 0 && (
        <p className="text-sm text-gray-500 mt-1">
          {rating === 5
            ? "완벽해요! 감사합니다 😊"
            : rating >= 4
              ? "좋아요! 감사합니다 😊"
              : rating >= 3
                ? "감사합니다! 더 나은 추천을 위해 노력할게요"
                : "소중한 평가 감사합니다. 더 나은 추천을 위해 노력하겠습니다"}
        </p>
      )}

      <div className="w-full mt-2">
        <p className="text-sm font-medium mb-2" style={{ color: accentColor }}>
          냠냠봇에게 전달하는 한마디
        </p>
        <div className="flex gap-2 items-start">
          <Textarea
            value={feedback}
            onChange={handleFeedbackChange}
            placeholder="저는 여러분의 마음을 알고싶어요..0_<"
            className="min-h-[60px] max-h-[60px] border-2 focus-visible:ring-1 flex-1"
            style={{ borderColor: `${accentColor}40` }}
          />
          <Button
            onClick={handleSendFeedback}
            disabled={!rating || isSending || isSent}
            className="px-3 h-[60px]"
            style={{ backgroundColor: accentColor }}
          >
            {isSending ? (
              <span className="animate-spin">⏳</span>
            ) : isSent ? (
              <span>✓</span>
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
        {isSent && <p className="text-xs text-green-600 mt-1 text-right">피드백이 성공적으로 전송되었습니다!</p>}
      </div>
    </div>
  )
}
