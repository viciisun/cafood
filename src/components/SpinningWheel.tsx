'use client'

import { useState, useRef, useEffect } from 'react'
import { Shop } from '@prisma/client'
import { getAnalogousColors } from '../theme'

interface SpinningWheelProps {
  shops: Shop[]
  onSpinEnd: (shop: Shop) => void
}

// 颜色配置
const COLORS = [
  '#6C5B7B', '#45B7D1', '#4ECDC4', '#96CEB4', '#FFD93D', '#FF6B6B',
  '#FF9A8B', '#88D8B0', '#7F7EFF', '#FFA07A', '#98AFC7', '#DEB887',
]

const MAX_VISIBLE_NAMES = 12 // 最大显示店名数量
const MAX_NAME_LENGTH = 10 // 店名最大长度

// 修改动画定义
const animations = `
/* iOS 设备使用简单的透明度动画 */
@supports (-webkit-touch-callout: none) {
  @keyframes color-cycle {
    0% { 
      opacity: 0.85;
      fill: var(--color-1);
    }
    25% { 
      opacity: 1;
      fill: var(--color-2);
    }
    50% { 
      opacity: 0.95;
      fill: var(--color-3);
    }
    75% { 
      opacity: 1;
      fill: var(--color-2);
    }
    100% { 
      opacity: 0.85;
      fill: var(--color-1);
    }
  }
}

/* 其他设备（PC等）使用更丰富的渐变效果 */
@supports not (-webkit-touch-callout: none) {
  @keyframes color-cycle {
    0% { 
      fill: var(--color-1);
      filter: brightness(1) saturate(1);
    }
    25% { 
      fill: var(--color-2);
      filter: brightness(1.1) saturate(1.2);
    }
    50% { 
      fill: var(--color-3);
      filter: brightness(1.2) saturate(1.3);
    }
    75% { 
      fill: var(--color-2);
      filter: brightness(1.1) saturate(1.2);
    }
    100% { 
      fill: var(--color-1);
      filter: brightness(1) saturate(1);
    }
  }
}

@keyframes firework {
  0% { transform: translate(var(--x), var(--y)) scale(0); opacity: 1; }
  50% { transform: translate(calc(var(--x) * 4), calc(var(--y) * 4)) scale(1.5); opacity: 1; }
  100% { transform: translate(calc(var(--x) * 5), calc(var(--y) * 5)) scale(0.8); opacity: 0; }
}

@keyframes text-scale {
  0% { transform: scale(1); }
  100% { transform: scale(1.5); }
}

@keyframes color-cycle-mobile {
  0% { opacity: 0.7; }
  50% { opacity: 1; }
  100% { opacity: 0.7; }
}

@keyframes color-cycle-desktop {
  0% { 
    filter: brightness(1.1) saturate(1.2);
    fill: var(--original-color);
  }
  25% {
    filter: brightness(1.2) saturate(1.3);
    fill: var(--blend-color-1);
  }
  50% { 
    filter: brightness(1.3) saturate(1.4);
    fill: var(--blend-color-2);
  }
  75% {
    filter: brightness(1.2) saturate(1.3);
    fill: var(--blend-color-1);
  }
  100% { 
    filter: brightness(1.1) saturate(1.2);
    fill: var(--original-color);
  }
}
`;

export default function SpinningWheel({ shops, onSpinEnd }: SpinningWheelProps) {
  // 基础状态
  const [rotation, setRotation] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  
  // 窗口宽度状态（用于响应式）
  const [windowWidth] = useState(window.innerWidth)

  // 定时器引用
  const spinTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const endTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // 是否显示店名
  const showNames = shops.length <= MAX_VISIBLE_NAMES

  // 累积的旋转角度
  const [totalRotation, setTotalRotation] = useState(0)

  // 添加音效
  const niceSound = useRef<HTMLAudioElement | null>(null)
  
  useEffect(() => {
    niceSound.current = new Audio('/sounds/nice.mp3') // 需要添加音效文件
  }, [])

  // 清理定时器
  useEffect(() => {
    return () => {
      if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current)
      if (endTimeoutRef.current) clearTimeout(endTimeoutRef.current)
    }
  }, [])

  // 礼花效果状态
  const [showFireworks, setShowFireworks] = useState(false)

  // 处理选中效果
  const handleSelection = (index: number) => {
    setSelectedIndex(index)
    setShowFireworks(true)
    // 播放音效
    niceSound.current?.play().catch(() => {})
    // 移动端震动
    if (navigator.vibrate) {
      navigator.vibrate(200)
    }
    // 3秒后隐藏礼花
    setTimeout(() => setShowFireworks(false), 3000)
  }

  // 旋转处理函数
  const spinWheel = () => {
    if (isSpinning || shops.length === 0) return

    if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current)
    if (endTimeoutRef.current) clearTimeout(endTimeoutRef.current)

    setIsSpinning(true)
    setSelectedIndex(null)

    const fixedRotation = 1800 // 5 * 360
    const randomRotation = Math.floor(Math.random() * 360)
    const newRotation = totalRotation + fixedRotation + randomRotation

    setTotalRotation(newRotation)
    setRotation(newRotation)

    spinTimeoutRef.current = setTimeout(() => {
      const finalRotation = newRotation % 360
      const selectedSegment = Math.floor(finalRotation / (360 / shops.length))
      const actualSelectedIndex = shops.length - selectedSegment - 1
      handleSelection(actualSelectedIndex)
    }, 4800)

    endTimeoutRef.current = setTimeout(() => {
      setIsSpinning(false)
      const finalRotation = newRotation % 360
      const selectedSegment = Math.floor(finalRotation / (360 / shops.length))
      const actualSelectedIndex = shops.length - selectedSegment - 1
      onSpinEnd(shops[actualSelectedIndex])
    }, 5000)
  }

  // 截断店名
  const truncateName = (name: string, isSelected: boolean) => {
    if (isSelected || name.length <= MAX_NAME_LENGTH) return name
    return `${name.slice(0, MAX_NAME_LENGTH)}...`
  }

  // 创建扇形路径
  const createSegmentPath = (index: number) => {
    const angle = 360 / shops.length
    const startAngle = index * angle
    const endAngle = (index + 1) * angle
    const start = polarToCartesian(50, 50, 50, startAngle)
    const end = polarToCartesian(50, 50, 50, endAngle)
    const largeArcFlag = angle <= 180 ? 0 : 1

    return `M 50 50 L ${start.x} ${start.y} A 50 50 0 ${largeArcFlag} 1 ${end.x} ${end.y} Z`
  }

  // 角度转换为坐标
  const polarToCartesian = (centerX: number, centerY: number, radius: number, angle: number) => {
    const angleInRadians = (angle - 90) * Math.PI / 180.0
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    }
  }

  const wheelSize = windowWidth < 768 ? 320 : 500

  return (
    <div className="relative mx-auto" style={{ width: wheelSize, height: wheelSize }}>
      <style>{animations}</style>
      
      {/* 指针 - 位于0度位置 */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20">
        <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[30px] border-t-red-500 filter drop-shadow-md" />
      </div>

      {/* 转盘主体 */}
      <div
        className="absolute inset-0 rounded-full overflow-hidden transition-all duration-5000 ease-out will-change-transform bg-white shadow-xl"
        style={{
          transform: `rotate(${rotation}deg)`,
        }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            {/* 增强选中扇形的动画效果 */}
            <radialGradient id="selected-gradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="white" stopOpacity="0.6">
                <animate
                  attributeName="stopOpacity"
                  values="0.6;0.8;0.6"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
            {/* 发光效果使用对比色 */}
            <filter id="glow">
              <feFlood floodColor="var(--complement-color)" result="flood" />
              <feComposite operator="in" in="flood" in2="SourceAlpha" result="mask" />
              <feGaussianBlur in="mask" stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* 外部阴影效果 */}
            <filter id="outer-shadow">
              <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
              <feOffset dx="1" dy="1" result="offsetblur" />
              <feFlood floodColor="rgba(0,0,0,0.5)" />
              <feComposite in2="offsetblur" operator="in" />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* 发光效果 */}
            <filter id="segment-glow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feFlood floodColor="gold" result="color" />
              <feComposite operator="in" in="color" in2="blur" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            
            {/* 亮度增强 */}
            <filter id="brightness">
              <feComponentTransfer>
                <feFuncR type="linear" slope="1.5" />
                <feFuncG type="linear" slope="1.5" />
                <feFuncB type="linear" slope="1.5" />
              </feComponentTransfer>
            </filter>
          </defs>
          {/* 先渲染所有扇形 */}
          {shops.map((shop, index) => {
            const color = COLORS[index % COLORS.length]
            const isSelected = selectedIndex === index
            
            return (
              <path
                key={`segment-${shop.id}`}
                d={createSegmentPath(index)}
                fill={color}
                className="transition-all duration-300"
                style={{
                  '--color-1': color,
                  '--color-2': getAnalogousColors(color)[0],
                  '--color-3': getAnalogousColors(color)[1],
                  animation: isSelected && !isSpinning 
                    ? 'color-cycle 3s ease-in-out infinite'
                    : 'none',
                } as React.CSSProperties}
              />
            )
          })}
          
          {/* 然后渲染所有文字，确保文字在扇形上层 */}
          {showNames && shops.map((shop, index) => {
            const isSelected = selectedIndex === index
            
            return (
              <g key={`text-${shop.id}`}>
                <g transform={`
                  rotate(${(index * 360) / shops.length + 360 / (shops.length * 2)}, 50, 50)
                  translate(0, -37.5)
                `}>
                  <g style={{
                    transform: !isSpinning && isSelected ? 'scale(1.5)' : 'scale(1)',
                    transition: 'transform 0.3s ease',
                    transformOrigin: 'center',
                    transformBox: 'fill-box',
                  }}>
                    <text
                      x="50"
                      y="50"
                      fill="white"
                      fontSize={windowWidth < 768 ? "4.5" : "5.5"}
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      style={{
                        textShadow: isSelected && !isSpinning
                          ? '2px 2px 4px rgba(0,0,0,0.8), -2px -2px 4px rgba(0,0,0,0.8)'
                          : '1px 1px 2px rgba(0,0,0,0.5)',
                      }}
                      className="select-none"
                    >
                      {truncateName(shop.name, isSelected)}
                    </text>
                  </g>
                </g>
              </g>
            )
          })}
        </svg>
      </div>

      {/* 增强礼花效果 */}
      {showFireworks && (
        <div className="absolute top-1/2 left-1/2 pointer-events-none">
          {[...Array(60)].map((_, i) => { // 增加粒子数量
            const angle = (i * Math.PI * 2) / 30
            const distance = Math.random() * 40 + 20 // 增加距离
            const x = Math.cos(angle) * distance
            const y = Math.sin(angle) * distance
            const size = Math.random() * 3 + 5 // 随机大小
            const color = COLORS[Math.floor(Math.random() * COLORS.length)]
            const delay = Math.random() * 1 // 随机延迟
            
            return (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  '--x': `${x}px`,
                  '--y': `${y}px`,
                  width: `${size}px`,
                  height: `${size}px`,
                  backgroundColor: color,
                  animation: 'firework 2s ease-out forwards',
                  animationDelay: `${delay}s`,
                } as React.CSSProperties}
              />
            )
          })}
        </div>
      )}

      {/* 中心按钮 */}
      <button
        onClick={spinWheel}
        disabled={isSpinning}
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                   rounded-full bg-white shadow-xl
                   border-4 border-gray-200 z-20 font-bold
                   transition-all duration-200 select-none
                   ${isSpinning ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 active:scale-95'}`}
        style={{
          width: windowWidth < 768 ? '4.5rem' : '5rem',
          height: windowWidth < 768 ? '4.5rem' : '5rem',
          fontSize: windowWidth < 768 ? '1rem' : '1.25rem',
        }}
      >
        {isSpinning ? '转动中' : '转动'}
      </button>
    </div>
  )
} 