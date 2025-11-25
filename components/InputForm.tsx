"use client"

interface AuthInputProps {
  label: string
  name: string
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function AuthInput({
  label,
  name,
  type = "text",
  value,
  onChange,
}: AuthInputProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm text-gray-300">{label}</label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2.5 min-h-16 rounded-xl bg-gray-800/60 border border-gray-600 
                   text-white text-2xl focus:ring-2 focus:ring-[#FFD700] outline-none"
      />
    </div>
  )
}
