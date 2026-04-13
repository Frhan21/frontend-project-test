import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRegister } from '@/hooks/auth/use-register'
import { ArrowRight, BriefcaseBusiness, LockKeyhole, Mail, UserRound } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router'

export default function RegisterPage() {
  const registerMutation = useRegister()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmation_password: '',
    },
  })

  const passwordValue = watch('password')
  const onSubmit = handleSubmit((values) => {
    registerMutation.mutate(values)
  })

  return (
    <Card className="border-border/60 bg-[#fffdf8]/95 py-0 shadow-[0_32px_80px_-56px_rgba(16,42,67,0.5)] backdrop-blur">
      <CardHeader className="border-b border-border/60 py-6">
        <Badge variant="outline" className="w-fit">
          Onboarding
        </Badge>
        <CardTitle className="text-3xl tracking-tight">Buat akun internal</CardTitle>
        <CardDescription className="max-w-sm text-sm leading-6">
          Registrasi ini menyiapkan session lokal untuk simulasi auth flow frontend
          sebelum dihubungkan ke backend asli.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 py-6">
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="name">Nama lengkap</Label>
            <div className="relative">
              <UserRound className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="name"
                className="h-11 pl-10"
                placeholder="Nama tim atau user"
                {...register('name', {
                  required: 'Nama wajib diisi.',
                  minLength: {
                    value: 3,
                    message: 'Nama minimal 3 karakter.',
                  },
                })}
              />
            </div>
            {errors.name ? (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="register-email">Email</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="register-email"
                type="email"
                className="h-11 pl-10"
                placeholder="you@company.dev"
                {...register('email', {
                  required: 'Email wajib diisi.',
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: 'Format email belum valid.',
                  },
                })}
              />
            </div>
            {errors.email ? (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="register-password">Password</Label>
            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="register-password"
                type="password"
                className="h-11 pl-10"
                placeholder="Minimal 8 karakter"
                {...register('password', {
                  required: 'Password wajib diisi.',
                  minLength: {
                    value: 8,
                    message: 'Password minimal 8 karakter.',
                  },
                })}
              />
            </div>
            {errors.password ? (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Konfirmasi password</Label>
            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="confirm-password"
                type="password"
                className="h-11 pl-10"
                placeholder="Ulangi password"
                {...register('confirmation_password', {
                  required: 'Konfirmasi password wajib diisi.',
                  validate: (value) =>
                    value === passwordValue || 'Konfirmasi password harus sama dengan password.',
                })}
              />
            </div>
            {errors.confirmation_password ? (
              <p className="text-sm text-destructive">
                {errors.confirmation_password.message}
              </p>
            ) : null}
          </div>

          <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-4 text-sm leading-6 text-muted-foreground">
            <div className="mb-2 flex items-center gap-2 font-medium text-foreground">
              <BriefcaseBusiness className="size-4" />
              Default role setelah register
            </div>
            User baru akan langsung masuk sebagai <span className="font-medium text-foreground">Manager</span>.
          </div>

          <Button
            type="submit"
            size="lg"
            className="h-11 w-full justify-center"
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? 'Membuat akun...' : 'Register dan lanjut'}
            <ArrowRight className="size-4" />
          </Button>
        </form>

        {registerMutation.error ? (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
            {registerMutation.error instanceof Error
              ? registerMutation.error.message
              : 'Terjadi kesalahan saat register.'}
          </div>
        ) : null}

        <p className="text-sm text-muted-foreground">
          Sudah punya akun?{' '}
          <Link to="/login" className="font-medium text-foreground underline underline-offset-4">
            Kembali ke login
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
