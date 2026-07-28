import { useState } from 'react'

export default function CommandInput({ onSubmit, placeholder = 'Type a command, sir…', className = '' }) {
  const [value, setValue] = useState('')

  const submit = () => {
    if (!value.trim()) return
    onSubmit(value)
    setValue('')
  }

  return (
    <form
      className={`command-input ${className}`}
      onSubmit={(e) => { e.preventDefault(); submit() }}
    >
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        aria-label="Type a command for Jarvis"
        autoComplete="off"
      />
      <button type="submit" aria-label="Send" disabled={!value.trim()}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M1 7h11M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </form>
  )
}
