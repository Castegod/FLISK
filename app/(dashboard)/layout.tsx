import ContactButton from "@/components/contact-button"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ContactButton />
    </>
  )
}
