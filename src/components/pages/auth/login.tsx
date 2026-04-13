import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLogin } from '@/hooks/auth/use-login'
import { ArrowRight, LockKeyhole, Mail } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router'

export default function LoginPage() {
  const loginMutation = useLogin()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = handleSubmit((values) => {
    loginMutation.mutate(values)
  })

  return (
    <Card className="border-border/60 bg-[#fffdf8]/95 py-0 shadow-[0_32px_80px_-56px_rgba(16,42,67,0.5)] backdrop-blur">
      <CardContent className="space-y-6 py-6">
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                className="h-11 pl-10"
                placeholder="admin@company.dev"
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
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                className="h-11 pl-10"
                placeholder="Masukkan password"
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

          <Button
            type="submit"
            size="lg"
            className="h-11 w-full justify-center"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? 'Memproses login...' : 'Login ke dashboard'}
            <ArrowRight className="size-4" />
          </Button>
        </form>

        {loginMutation.error ? (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
            {loginMutation.error instanceof Error
              ? loginMutation.error.message
              : 'Terjadi kesalahan saat login.'}
          </div>
        ) : null}

        <div className="rounded-2xl bg-muted/60 p-4 text-sm leading-6 text-muted-foreground">
          Demo account: <span className="font-medium text-foreground">admin@jagoanhosting.dev</span>
        </div>

        <p className="text-sm text-muted-foreground">
          Belum punya akun?{' '}
          <Link to="/register" className="font-medium text-foreground underline underline-offset-4">
            Buat akun baru
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
