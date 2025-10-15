import React from 'react'

interface Props {
    title: string;
    size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
    align?: "left" | "center" | "right";
    className?: string;
}
export const Title = ({ title, align = "left", size = "xl", className }: Props) => {
  return (
    <h2 className={`text-${size} font-bold text-${align} pb-3 ${className}`}>{title}</h2>
  )
}
