export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary py-6 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-primary-foreground">FILSK</h1>
          <p className="text-primary-foreground/70 text-sm">Bienestar Universitario UMNG</p>
        </div>
      </div>
      {children}
    </div>
  )
}
