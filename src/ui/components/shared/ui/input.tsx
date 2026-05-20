import { Input } from "@/src/ui/components/ui/input"
import { InputHTMLAttributes } from "react"
import { Search } from "lucide-react"

type Props = InputHTMLAttributes<HTMLInputElement> & {
  icon?: boolean
}

export function TextInput({ icon, className, ...props }: Props) {
  return (
    <div className="relative w-full">
      {icon && (
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      )}

      <Input
        {...props}
        className={`${icon ? "pl-8" : ""} ${className ?? ""}`}
      />
    </div>
  )
}