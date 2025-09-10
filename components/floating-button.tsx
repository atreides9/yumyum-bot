"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface FloatingButtonProps {
  onClick: () => void
  isLoading?: boolean
  accentColor?: string
  children: React.ReactNode
}

export function FloatingButton({ onClick, isLoading, accentColor = "#FF6B35", children }: FloatingButtonProps) {
  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
      <Button
        onClick={onClick}
        disabled={isLoading}
        className="px-12 py-8 text-2xl font-semibold rounded-full shadow-xl transition-transform hover:scale-105 active:scale-95"
        style={{ backgroundColor: accentColor }}
      >
        {isLoading ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : null}
        {children}
      </Button>
    </div>
  )
}
