import type React from "react"
interface ChartWrapperProps {
  content: React.ComponentType
  className?: string
  title?: string
}

export function ChartWrapper({ content: Chart, className, title }: ChartWrapperProps) {
  return (
    <div className={className}>
      {title && <h3 className="sr-only">{title}</h3>}
      <Chart />
    </div>
  )
}
