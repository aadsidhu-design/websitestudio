"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { X, Image as ImageIcon, ArrowUp } from "lucide-react"

import { cn } from "@/lib/utils"

interface UseAutoResizeTextareaProps {
  minHeight: number
  maxHeight?: number
}

function useAutoResizeTextarea({
  minHeight,
  maxHeight,
}: UseAutoResizeTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const adjustHeight = useCallback(
    (reset?: boolean) => {
      const textarea = textareaRef.current
      if (!textarea) return

      if (reset) {
        textarea.style.height = `${minHeight}px`
        return
      }

      textarea.style.height = `${minHeight}px`
      const newHeight = Math.max(
        minHeight,
        Math.min(textarea.scrollHeight, maxHeight ?? Number.POSITIVE_INFINITY)
      )

      textarea.style.height = `${newHeight}px`
    },
    [minHeight, maxHeight]
  )

  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = `${minHeight}px`
    }
  }, [minHeight])

  useEffect(() => {
    const handleResize = () => adjustHeight()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [adjustHeight])

  return { textareaRef, adjustHeight }
}

const MIN_HEIGHT = 48
const MAX_HEIGHT = 164

export function AiInput({ onSubmit, disabled, className, placeholder = "Ask Robin to build something..." }: { onSubmit: (formData: FormData) => void, disabled?: boolean, className?: string, placeholder?: string }) {
  const [input, setInput] = useState("")
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: MIN_HEIGHT,
    maxHeight: MAX_HEIGHT,
  })
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const removeImage = (e: any) => {
    e.preventDefault()
    e.stopPropagation()
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    setSelectedImage(null)
  }

  const handleImageUpload = (e: any) => {
    const file = e.target.files ? e.target.files[0] : null
    if (file) {
      setSelectedImage(URL.createObjectURL(file))
    }
  }

  const handleSend = () => {
    if (!disabled && (input.trim() || selectedImage)) {
      const formData = new FormData();
      formData.set('prompt', input);
      // In a real app, we'd append the file too
      onSubmit(formData);
      setInput("")
      setSelectedImage(null)
      if (fileInputRef.current) fileInputRef.current.value = "";
      adjustHeight(true)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    return () => {
      if (selectedImage) {
        URL.revokeObjectURL(selectedImage)
      }
    }
  }, [selectedImage])

  return (
    <div className={cn("relative w-full group", className)}>
      <div
        className={cn(
          "relative flex flex-col w-full bg-muted/30 border border-input rounded-lg transition-all duration-200",
          "focus-within:ring-1 focus-within:ring-primary/20 focus-within:border-primary/50",
          "hover:border-accent-foreground/20"
        )}
      >
        {selectedImage && (
          <div className="px-3 pt-3">
            <div className="relative inline-block">
              <img
                src={selectedImage}
                alt="Selected"
                className="h-16 w-auto rounded-md border border-border/50 object-cover"
              />
              <button
                onClick={removeImage}
                className="absolute -top-2 -right-2 bg-background border border-border rounded-full p-0.5 shadow-sm hover:bg-destructive hover:text-destructive-foreground transition-colors"
              >
                <X size={12} />
              </button>
            </div>
          </div>
        )}

        <div className="flex items-end gap-2 p-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-md transition-colors"
            title="Attach image"
          >
            <ImageIcon size={18} />
          </button>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageUpload}
          />

          <div className="relative flex-1 min-h-[24px] max-h-[200px]">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value)
                adjustHeight()
              }}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled}
              className="w-full bg-transparent border-0 p-0 text-sm placeholder:text-muted-foreground/50 focus:ring-0 resize-none py-2 min-h-[24px] max-h-[200px] scrollbar-hide"
              rows={1}
            />
          </div>

          <button
            onClick={handleSend}
            disabled={(!input.trim() && !selectedImage) || disabled}
            className={cn(
              "p-2 rounded-md transition-all duration-200 flex items-center justify-center",
              (input.trim() || selectedImage) && !disabled
                ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
            )}
          >
            <ArrowUp size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
