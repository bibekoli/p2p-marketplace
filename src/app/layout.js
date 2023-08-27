import "@/styles/globals.css"
import { Inter } from "next/font/google"

const font = Inter({
  subsets: ["latin"]
})

export const metadata = {
  title: "P2P Marketplace",
  description: "Buy and sell things directly without third party.",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={font.className}>
        {children}
      </body>
    </html>
  )
}