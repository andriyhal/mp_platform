'use client'

import { useState, useEffect, useRef } from 'react'

/**
 * Props for the SegmentedGauge component
 */
interface SegmentedGaugeProps {
  /** Progress value from 0 to 100 */
  value: number
  /** Number of segments across the 180° arc */
  totalSegments?: number
  /** Start angle in degrees (-90 to +90 for bottom semicircle) */
  startAngle?: number
  /** End angle in degrees */
  endAngle?: number
  /** Outer radius in pixels */
  radius?: number
  /** Arc thickness in pixels */
  thickness?: number
  /** Gap between segments in degrees */
  gapAngle?: number
  /** Progress color */
  activeColor?: string
  /** Base/empty color */
  inactiveColor?: string
  /** Background track color (optional) */
  trackColor?: string
  /** Enable animation */
  animate?: boolean
  /** Animation duration in milliseconds */
  animationDurationMs?: number
  /** Show percentage label */
  showLabel?: boolean
  /** Custom label formatter */
  labelFormatter?: (value: number) => string
  /** Container CSS class */
  className?: string
  /** ARIA label for accessibility */
  ariaLabel?: string
}

/**
 * A segmented semicircular gauge component that displays progress as colored segments
 */
export function SegmentedGauge({
  value,
  totalSegments = 32,
  startAngle = -90,
  endAngle = 90,
  radius = 160,
  thickness = 24,
  gapAngle = 2,
  activeColor = '#8EE17F',
  inactiveColor = '#F1F3F8',
  trackColor = 'transparent',
  animate = true,
  animationDurationMs = 900,
  showLabel = true,
  labelFormatter = (v) => `${Math.round(v)}%`,
  className = '',
  ariaLabel
}: SegmentedGaugeProps) {
  // Clamp value to valid range
  const clampedValue = Math.max(0, Math.min(100, value))
  
  // Animation state
  const [displayValue, setDisplayValue] = useState(animate ? 0 : clampedValue)
  const animationRef = useRef<number>()
  const startTimeRef = useRef<number>()
  const startValueRef = useRef<number>(0)

  // Animate value changes
  useEffect(() => {
    if (!animate) {
      setDisplayValue(clampedValue)
      return
    }

    const animateValue = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp
        startValueRef.current = displayValue
      }

      const elapsed = timestamp - startTimeRef.current
      const progress = Math.min(elapsed / animationDurationMs, 1)
      
      // Easing function (ease-out)
      const eased = 1 - Math.pow(1 - progress, 3)
      const newValue = startValueRef.current + (clampedValue - startValueRef.current) * eased
      
      setDisplayValue(newValue)

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animateValue)
      } else {
        startTimeRef.current = undefined
      }
    }

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
    
    animationRef.current = requestAnimationFrame(animateValue)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [clampedValue, animate, animationDurationMs, displayValue])

  // Convert degrees to radians
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180

  // Calculate segment properties
  const totalAngleSpan = endAngle - startAngle
  const segmentAngle = totalAngleSpan / totalSegments
  const visibleSegmentAngle = segmentAngle - gapAngle
  const activeSegments = Math.round((displayValue / 100) * totalSegments)

  // SVG dimensions
  const svgSize = (radius + thickness / 2) * 2 + 20 // Add padding
  const centerX = svgSize / 2
  const centerY = svgSize / 2

  // Create path for a segment
  const createSegmentPath = (segmentIndex: number) => {
    const segmentStartAngle = startAngle + segmentIndex * segmentAngle + gapAngle / 2
    const segmentEndAngle = segmentStartAngle + visibleSegmentAngle

    const startAngleRad = toRadians(segmentStartAngle)
    const endAngleRad = toRadians(segmentEndAngle)

    const outerRadius = radius
    const innerRadius = radius - thickness

    // Outer arc points
    const x1 = centerX + outerRadius * Math.cos(startAngleRad)
    const y1 = centerY + outerRadius * Math.sin(startAngleRad)
    const x2 = centerX + outerRadius * Math.cos(endAngleRad)
    const y2 = centerY + outerRadius * Math.sin(endAngleRad)

    // Inner arc points
    const x3 = centerX + innerRadius * Math.cos(endAngleRad)
    const y3 = centerY + innerRadius * Math.sin(endAngleRad)
    const x4 = centerX + innerRadius * Math.cos(startAngleRad)
    const y4 = centerY + innerRadius * Math.sin(startAngleRad)

    // Large arc flag (1 if arc is > 180°)
    const largeArcFlag = visibleSegmentAngle > 180 ? 1 : 0

    return `
      M ${x1} ${y1}
      A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}
      L ${x3} ${y3}
      A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}
      Z
    `
  }

  // Create background track (optional)
  const createTrackPath = () => {
    if (trackColor === 'transparent') return null

    const startAngleRad = toRadians(startAngle)
    const endAngleRad = toRadians(endAngle)

    const outerRadius = radius
    const innerRadius = radius - thickness

    const x1 = centerX + outerRadius * Math.cos(startAngleRad)
    const y1 = centerY + outerRadius * Math.sin(startAngleRad)
    const x2 = centerX + outerRadius * Math.cos(endAngleRad)
    const y2 = centerY + outerRadius * Math.sin(endAngleRad)

    const x3 = centerX + innerRadius * Math.cos(endAngleRad)
    const y3 = centerY + innerRadius * Math.sin(endAngleRad)
    const x4 = centerX + innerRadius * Math.cos(startAngleRad)
    const y4 = centerY + innerRadius * Math.sin(startAngleRad)

    const largeArcFlag = totalAngleSpan > 180 ? 1 : 0

    return `
      M ${x1} ${y1}
      A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}
      L ${x3} ${y3}
      A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}
      Z
    `
  }

  const ariaLabelText = ariaLabel || `Progress: ${Math.round(displayValue)} percent`

  return (
    <figure 
      role="img" 
      aria-label={ariaLabelText}
      className={`inline-flex flex-col items-center ${className}`}
    >
      <div className="relative">
        <svg
          width={svgSize}
          height={svgSize / 2 + 40}
          viewBox={`0 0 ${svgSize} ${svgSize / 2 + 40}`}
          className="overflow-visible"
          shapeRendering="geometricPrecision"
        >
          <title>{labelFormatter(displayValue)}</title>
          
          {/* Background track */}
          {trackColor !== 'transparent' && createTrackPath() && (
            <path
              d={createTrackPath()!}
              fill={trackColor}
            />
          )}

          {/* Segments */}
          {Array.from({ length: totalSegments }, (_, i) => {
            const isActive = i < activeSegments
            const segmentPath = createSegmentPath(i)
            
            return (
              <path
                key={i}
                d={segmentPath}
                fill={isActive ? activeColor : inactiveColor}
                className="transition-colors duration-150"
                suppressHydrationWarning
              />
            )
          })}
        </svg>

        {/* Label */}
        {showLabel && (
          <div 
            className="absolute inset-x-0 flex justify-center"
            style={{ top: `${centerY + 20}px` }}
          >
            <span className="text-3xl font-bold text-black">
              {labelFormatter(displayValue)}
            </span>
          </div>
        )}
      </div>
    </figure>
  )
}
