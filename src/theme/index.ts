export const theme = {
  colors: {
    primary: '#6C5B7B',
    background: '#F8F9FA',
    surface: '#FFFFFF',
    text: {
      primary: '#2D3748',
      secondary: '#718096',
      light: '#FFFFFF',
    },
    tabBar: {
      background: '#FFFFFF',
      active: '#4A5568',
      inactive: '#A0AEC0',
    }
  },
  spacing: {
    safeArea: {
      top: 'env(safe-area-inset-top)',
      bottom: 'env(safe-area-inset-bottom)',
    }
  }
}

// 获取相近色函数
export function getAnalogousColors(color: string): [string, string] {
  const hsl = hexToHSL(color)
  const hue = hsl.h
  
  // 在色轮上向两边偏移30度获取相近色
  const color1 = HSLToHex({ h: (hue - 30 + 360) % 360, s: hsl.s, l: hsl.l })
  const color2 = HSLToHex({ h: (hue + 30) % 360, s: hsl.s, l: hsl.l })
  
  return [color1, color2]
}

// 辅助函数
function hexToHSL(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)!
  const r = parseInt(result[1], 16) / 255
  const g = parseInt(result[2], 16) / 255
  const b = parseInt(result[3], 16) / 255
  
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0, s, l = (max + min) / 2
  
  if (max === min) {
    h = s = 0
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h /= 6
  }
  
  return { h: h * 360, s: s * 100, l: l * 100 }
}

function HSLToHex({ h, s, l }: { h: number; s: number; l: number }) {
  l /= 100
  const a = s * Math.min(l, 1 - l) / 100
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color).toString(16).padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
} 