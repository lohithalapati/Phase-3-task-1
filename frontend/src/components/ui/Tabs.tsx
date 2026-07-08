import { useState } from 'react'
import { motion } from 'framer-motion'

interface TabItem {
  label: string
  content: React.ReactNode
}

interface TabsProps {
  tabs: TabItem[]
}

export const Tabs = ({ tabs }: TabsProps) => {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <div className="w-full">
      <div className="relative flex gap-4 border-b border-white/10">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className="relative px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            {tab.label}

            {activeIndex === index && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#3B82F6] via-[#06B6D4] to-[#8B5CF6]"
              />
            )}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tabs[activeIndex].content}
      </div>
    </div>
  )
}
