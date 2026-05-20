import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"
import { Label } from "@/src/ui/components/ui/label"

const buttonVariants = cva(
    "inline-flex items-center justify-center rounded-[var(--radius)] text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
    {
        variants: {
            variant: {
                // Usa o seu --primary (que no dark é um cinza bem claro)
                default: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",

                // Perfeito para o Dark Mode: fundo levemente mais claro que o background geral
                secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",

                // Efeito de contorno sutil usando suas variáveis de input/border
                outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",

                // Botão "Ghost" para ações menos importantes
                ghost: "hover:bg-accent hover:text-accent-foreground text-muted-foreground hover:text-foreground",

                // Uma versão "Premium" sem cores vibrantes, apenas brilho
                shiny: "bg-background border border-border text-foreground shadow-[0_0_20px_rgba(255,255,255,0.03)] hover:border-foreground/30 hover:bg-accent transition-all",

                destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-8 px-3 text-xs",
                lg: "h-12 px-8 text-base",
                icon: "h-9 w-9",
            },
            fullWidth: {
                true: "w-full",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    text?: string,    
    asChild?: boolean
    isLoading?: boolean
    icon?: React.ReactNode
}

const CustomButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, fullWidth, asChild = false, isLoading, icon, children, text, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, fullWidth, className }), "h-8 px-2 sm:h-8 sm:px-3 sm:text-xs lg:h-9 lg:px-3 lg:text-base")}
                ref={ref}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}

                {text && !icon && <Label>{text}</Label>}
                {!text && icon && !isLoading && <span>{icon}</span>}
                {text && icon &&
                    <div className="flex flex-row items-center justify-center gap-1.5">
                        {!isLoading && <span>{icon}</span>}
                        <Label className="text-md hidden md:block">{text}</Label>
                    </div>
                }
                

            </Comp>
        )
    }
)
CustomButton.displayName = "CustomButton"

export { CustomButton, buttonVariants }