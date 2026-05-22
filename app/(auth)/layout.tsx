import Image from "next/image"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary py-4 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-4">
          <Image src="/logo.svg" alt="UMNG" width={40} height={46} className="h-12 w-auto" />
          <div>
            <h1 className="text-2xl font-bold text-primary-foreground">FILSK - Bienestar Universitario</h1>
            <p className="text-primary-foreground/70 text-xs">Universidad Militar Nueva Granada</p>
          </div>
        </div>
      </div>
      {children}
    </div>
  )
}
