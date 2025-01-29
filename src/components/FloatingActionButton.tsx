import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export interface Action {
  icon: React.ReactNode
  label: string
  onClick: () => void
  color?: string
}

interface FloatingActionButtonProps {
  mainIcon: React.ReactNode
  actions: Action[]
  position?: 'top-right' | 'bottom-right'
  mainColor?: string
  direction?: 'up' | 'down'
}

export default function FloatingActionButton({
  mainIcon,
  actions,
  position = 'bottom-right',
  mainColor = 'bg-[#6C5B7B] hover:bg-[#6C5B7B]/90',
  direction = 'up',
}: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'bottom-right': 'bottom-20 right-4',
  }

  return (
    <div className={`fixed ${positionClasses[position]} z-50`}>
      <AnimatePresence>
        {isOpen && actions.map((action, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            onClick={() => {
              setIsOpen(false)
              action.onClick()
            }}
            className={`absolute right-0 flex items-center group ${
              action.color || 'bg-[#9B8AA6] hover:bg-[#9B8AA6]/90'
            } rounded-full shadow-lg w-12 h-12`}
            style={{
              [direction === 'up' ? 'bottom' : 'top']: `${(index + 1) * 64 + 8}px`, // 64px 间距 + 8px focus ring 偏移
            }}
          >
            <span className="absolute right-full mr-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {action.label}
            </span>
            <div className="w-full h-full flex items-center justify-center text-white">
              {action.icon}
            </div>
          </motion.button>
        ))}
      </AnimatePresence>

      <motion.button
        className={`w-14 h-14 ${mainColor} rounded-full shadow-lg flex items-center justify-center text-white ${
          isOpen ? 'ring-2 ring-offset-2 ring-[#6C5B7B]' : ''
        }`}
        onClick={() => setIsOpen(!isOpen)}
        animate={{ rotate: isOpen ? 45 : 0 }}
        transition={{ duration: 0.2 }}
      >
        {mainIcon}
      </motion.button>
    </div>
  )
} 