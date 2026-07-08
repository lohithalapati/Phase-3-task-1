import { useState } from 'react'
import { Input } from './Input'

interface PasswordInputProps {
  label?: string
  error?: string
  placeholder?: string
}

export const PasswordInput = ({
  label,
  error,
  placeholder = 'Enter password',
}: PasswordInputProps) => {

  const [visible, setVisible] = useState(false)

  return (
    <div className="relative">
      <Input
        label={label}
        error={error}
        type={visible ? 'text' : 'password'}
        placeholder={placeholder}
      />

      <button
        type="button"
        onClick={() => setVisible(!visible)}
        className="absolute right-3 top-9 text-slate-400 text-xs hover:text-white transition-colors"
      >
        {visible ? 'Hide' : 'Show'}
      </button>
    </div>
  )
}
