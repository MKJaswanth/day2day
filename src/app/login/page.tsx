import { LoginForm } from "@/components/auth/login-form"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-6">
      <LoginForm initialError={error} />
    </div>
  )
}
