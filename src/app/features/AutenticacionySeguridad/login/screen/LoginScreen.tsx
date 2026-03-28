import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Eye, EyeOff, Heart } from 'lucide-react'

const LoginScreen = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      console.log('Login:', { email, password })
      setIsLoading(false)
      alert('Login exitoso 🐶')
    }, 1500)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-700 px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-full bg-orange-500 flex items-center justify-center shadow-lg">
              <Heart className="w-7 h-7 text-white" fill="currentColor" />
            </div>
            <h1 className="text-3xl font-bold text-white">
              Pet Home
            </h1>
          </div>
          <p className="text-white/80 text-sm">
            Tu veterinaria de confianza
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6">

          <div>
            <h2 className="text-2xl font-bold text-purple-700">Bienvenido</h2>
            <p className="text-gray-500 text-sm">
              Inicia sesión para continuar
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">

            {/* Email */}
            <div>
              <label className="text-sm text-purple-700">Correo</label>
              <Input
                type="email"
                placeholder="correo@pethome.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="focus-visible:ring-orange-500"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <label className="text-sm text-purple-700">Contraseña</label>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pr-10 focus-visible:ring-orange-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-purple-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Button */}
            <Button
              disabled={isLoading}
              className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white"
            >
              {isLoading ? 'Cargando...' : 'Iniciar sesión'}
            </Button>
          </form>

          {/* Registro */}
          <Button
            variant="outline"
            className="w-full border-purple-500 text-purple-700 hover:bg-purple-50"
          >
            Crear cuenta
          </Button>

        </div>
      </div>
    </div>
  )
}

export default LoginScreen