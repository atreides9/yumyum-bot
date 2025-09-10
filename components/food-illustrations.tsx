"use client"

import { useEffect, useState } from "react"

interface FoodIllustrationsProps {
  accentColor?: string
}

export function FoodIllustrations({ accentColor = "#FF6B35" }: FoodIllustrationsProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* 왼쪽 상단 라면 */}
      <div className="absolute top-[5%] left-[5%] opacity-10 transform -rotate-12">
        <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 4.5C7 3.67157 7.67157 3 8.5 3C9.32843 3 10 3.67157 10 4.5V5H7V4.5Z" fill={accentColor} />
          <path d="M14 4.5C14 3.67157 14.6716 3 15.5 3C16.3284 3 17 3.67157 17 4.5V5H14V4.5Z" fill={accentColor} />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M2 8C2 7.44772 2.44772 7 3 7H21C21.5523 7 22 7.44772 22 8C22 8.55228 21.5523 9 21 9H20.9722C20.7238 9.60439 20.1238 10 19.5 10C18.8762 10 18.2762 9.60439 18.0278 9H16.9722C16.7238 9.60439 16.1238 10 15.5 10C14.8762 10 14.2762 9.60439 14.0278 9H12.9722C12.7238 9.60439 12.1238 10 11.5 10C10.8762 10 10.2762 9.60439 10.0278 9H8.97224C8.72381 9.60439 8.12381 10 7.5 10C6.87619 10 6.27619 9.60439 6.02776 9H4.97224C4.72381 9.60439 4.12381 10 3.5 10C2.87619 10 2.27619 9.60439 2.02776 9H2V8Z"
            fill={accentColor}
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M5 11.1707C5.31962 11.0602 5.65743 11 6 11H18C18.3426 11 18.6804 11.0602 19 11.1707V21H5V11.1707ZM8 14C8 13.4477 8.44772 13 9 13C9.55228 13 10 13.4477 10 14C10 14.5523 9.55228 15 9 15C8.44772 15 8 14.5523 8 14ZM12 16C11.4477 16 11 16.4477 11 17C11 17.5523 11.4477 18 12 18C12.5523 18 13 17.5523 13 17C13 16.4477 12.5523 16 12 16ZM14 14C14 13.4477 14.4477 13 15 13C15.5523 13 16 13.4477 16 14C16 14.5523 15.5523 15 15 15C14.4477 15 14 14.5523 14 14Z"
            fill={accentColor}
          />
        </svg>
      </div>

      {/* 오른쪽 상단 피자 */}
      <div className="absolute top-[15%] right-[8%] opacity-10 transform rotate-12">
        <svg width="140" height="140" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5Z"
            fill={accentColor}
          />
          <path d="M12 5L5 12H12V5Z" fill={accentColor} />
          <path d="M12 5L19 12H12V5Z" fill={accentColor} />
          <path d="M12 12L5 19C8.13401 19 12 15.866 12 12Z" fill={accentColor} />
          <path d="M12 12L19 19C15.866 19 12 15.866 12 12Z" fill={accentColor} />
          <circle cx="9" cy="9" r="1" fill={accentColor} />
          <circle cx="15" cy="9" r="1" fill={accentColor} />
          <circle cx="9" cy="15" r="1" fill={accentColor} />
          <circle cx="15" cy="15" r="1" fill={accentColor} />
          <circle cx="12" cy="12" r="1" fill={accentColor} />
        </svg>
      </div>

      {/* 왼쪽 하단 햄버거 */}
      <div className="absolute bottom-[10%] left-[8%] opacity-10 transform rotate-6">
        <svg width="130" height="130" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M2 7C2 6.44772 2.44772 6 3 6H21C21.5523 6 22 6.44772 22 7C22 7.55228 21.5523 8 21 8H3C2.44772 8 2 7.55228 2 7Z"
            fill={accentColor}
          />
          <path
            d="M3 11C2.44772 11 2 11.4477 2 12C2 12.5523 2.44772 13 3 13H21C21.5523 13 22 12.5523 22 12C22 11.4477 21.5523 11 21 11H3Z"
            fill={accentColor}
          />
          <path
            d="M2 17C2 16.4477 2.44772 16 3 16H21C21.5523 16 22 16.4477 22 17C22 17.5523 21.5523 18 21 18H3C2.44772 18 2 17.5523 2 17Z"
            fill={accentColor}
          />
          <path
            d="M4 9C3.44772 9 3 9.44772 3 10C3 10.5523 3.44772 11 4 11H20C20.5523 11 21 10.5523 21 10C21 9.44772 20.5523 9 20 9H4Z"
            fill={accentColor}
          />
          <path
            d="M3 14C3 13.4477 3.44772 13 4 13H20C20.5523 13 21 13.4477 21 14C21 14.5523 20.5523 15 20 15H4C3.44772 15 3 14.5523 3 14Z"
            fill={accentColor}
          />
        </svg>
      </div>

      {/* 오른쪽 하단 아이스크림 */}
      <div className="absolute bottom-[20%] right-[5%] opacity-10 transform -rotate-12">
        <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 2C9.79086 2 8 3.79086 8 6C8 6.25047 8.02409 6.49603 8.07016 6.73218C7.40888 7.19134 7 7.93025 7 8.75C7 9.44036 7.29289 10.0656 7.76822 10.5C7.29289 10.9344 7 11.5596 7 12.25C7 13.2165 7.59546 14.0373 8.45388 14.4144C8.16946 14.8866 8 15.4302 8 16C8 17.6569 9.34315 19 11 19H13C14.6569 19 16 17.6569 16 16C16 15.4302 15.8305 14.8866 15.5461 14.4144C16.4045 14.0373 17 13.2165 17 12.25C17 11.5596 16.7071 10.9344 16.2318 10.5C16.7071 10.0656 17 9.44036 17 8.75C17 7.93025 16.5911 7.19134 15.9298 6.73218C15.9759 6.49603 16 6.25047 16 6C16 3.79086 14.2091 2 12 2Z"
            fill={accentColor}
          />
          <path d="M11 19L10 22H14L13 19H11Z" fill={accentColor} />
        </svg>
      </div>

      {/* 중앙 상단 커피 */}
      <div className="absolute top-[30%] left-[50%] transform -translate-x-1/2 opacity-10">
        <svg width="100" height="100" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M5 3C4.44772 3 4 3.44772 4 4V5C4 5.55228 4.44772 6 5 6H19C19.5523 6 20 5.55228 20 5V4C20 3.44772 19.5523 3 19 3H5Z"
            fill={accentColor}
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M5 7C4.44772 7 4 7.44772 4 8V14C4 17.3137 6.68629 20 10 20H14C17.3137 20 20 17.3137 20 14V8C20 7.44772 19.5523 7 19 7H5ZM18 9H6V14C6 16.2091 7.79086 18 10 18H14C16.2091 18 18 16.2091 18 14V9Z"
            fill={accentColor}
          />
          <path
            d="M4 21C3.44772 21 3 21.4477 3 22C3 22.5523 3.44772 23 4 23H20C20.5523 23 21 22.5523 21 22C21 21.4477 20.5523 21 20 21H4Z"
            fill={accentColor}
          />
        </svg>
      </div>
    </div>
  )
}
