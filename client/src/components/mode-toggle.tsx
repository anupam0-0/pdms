"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ModeToggle() {
    const { theme, setTheme } = useTheme()
    // console.log(theme)

    return (
        <div className="relative" >
            {
                theme === 'dark' || theme === 'default'
                    ?
                    <Button variant='outline' size='icon' onClick={() => setTheme("light")}>
                        <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                    </Button>
                    : <Button variant='outline' size='icon' onClick={() => setTheme("dark")} >
                        <Sun className="absolute h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                    </Button>
            }
        </div>
    )
}
