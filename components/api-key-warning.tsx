"use client"

import type React from "react"

import { useState } from "react"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ApiKeyWarning() {
  const [apiKey, setApiKey] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // 실제 환경에서는 서버에 API 키를 저장하는 로직이 필요합니다
      // 여기서는 로컬 스토리지에 임시 저장합니다 (프로덕션에서는 권장하지 않음)
      localStorage.setItem("OPENAI_API_KEY", apiKey)
      setIsSuccess(true)
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    } catch (error) {
      console.error("API 키 저장 중 오류 발생:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Alert className="mb-6 border-yellow-500 bg-yellow-50">
      <AlertCircle className="h-4 w-4 text-yellow-500" />
      <AlertTitle className="text-yellow-700">OpenAI API 키 설정 (선택사항)</AlertTitle>
      <AlertDescription>
        <p className="mb-4 text-yellow-700">
          냠냠봇은 API 키 없이도 기본 추천을 제공하지만, 더 정확한 추천을 위해 OpenAI API 키를 설정할 수 있습니다.
          <a
            href="https://platform.openai.com/api-keys"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline ml-1"
          >
            OpenAI 웹사이트
          </a>
          에서 API 키를 생성하고 아래에 입력해주세요.
        </p>

        {isSuccess ? (
          <div className="p-2 bg-green-100 text-green-800 rounded">
            API 키가 저장되었습니다. 페이지를 새로고침합니다...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="apiKey">OpenAI API 키</Label>
              <Input
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                required
              />
            </div>
            <Button type="submit" className="w-full bg-[#FF6B35] hover:bg-[#E85826]" disabled={isSubmitting || !apiKey}>
              {isSubmitting ? "저장 중..." : "API 키 저장"}
            </Button>
            <p className="text-xs text-gray-500">
              * API 키는 브라우저에 임시 저장되며 서버로 전송되지 않습니다. 프로덕션 환경에서는 환경 변수를 사용하세요.
            </p>
          </form>
        )}
      </AlertDescription>
    </Alert>
  )
}
