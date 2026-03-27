import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Eye, EyeOff, Heart } from 'lucide-react'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 px-4">
      <div className="w-full max-w-md">
        
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
              <Heart className="w-7 h-7 text-primary-foreground" fill="currentColor" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Pet Home
            </h1>
          </div>
          <p className="text-muted-foreground text-sm">
            Tu veterinaria de confianza
          </p>
        </div>

        {/* Card */}
        <div className="bg-card rounded-2xl border border-border shadow-xl p-8 space-y-6">

          <div>
            <h2 className="text-2xl font-bold">Bienvenido</h2>
            <p className="text-muted-foreground text-sm">
              Inicia sesión para continuar
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">

            {/* Email */}
            <div>
              <label className="text-sm">Correo</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <label className="text-sm">Contraseña</label>
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>

            {/* Button */}
            <Button disabled={isLoading} className="w-full mt-4">
              {isLoading ? 'Cargando...' : 'Iniciar sesión'}
            </Button>
          </form>

          {/* Registro */}
          <Button variant="outline" className="w-full">
            Crear cuenta
          </Button>
        </div>
      </div>
    </div>
  )
}