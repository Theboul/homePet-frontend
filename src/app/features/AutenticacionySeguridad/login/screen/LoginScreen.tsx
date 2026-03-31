import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Eye, EyeOff, Heart } from 'lucide-react'
import { FormCrearPerfil } from '../components'
import { useLoginMutation } from '#/store/auth/authApi'
import { useAppDispatch } from '#/store/hooks'
import { setCredentials } from '#/store/auth/authSlice'

const LoginScreen = () => {


  const [openModal, setOpenModal] = useState(false)

  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [login, { isLoading }] = useLoginMutation()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    try {
      const result = await login({ correo, password }).unwrap()
      dispatch(
        setCredentials({
          user: result.user,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        }),
      )
      navigate({ to: '/dashboard' })
    } catch {
      setFormError('Correo o contraseña incorrectos.')
    }
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

            <div>
              <label className="text-sm text-purple-700">Correo</label>
              <Input
                type="email"
                placeholder="correo@pethome.com"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
              />
            </div>

            <div className="relative">
              <label className="text-sm text-purple-700">Contraseña</label>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-purple-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <Button
              disabled={isLoading}
              className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white"
            >
              {isLoading ? 'Cargando...' : 'Iniciar sesión'}
            </Button>

            {formError && (
              <p className="text-sm text-red-600" role="alert">
                {formError}
              </p>
            )}
          </form>

          <Button
            variant="outline"
            onClick={() => setOpenModal(true)}
            className="w-full border-purple-500 text-purple-700 hover:bg-purple-50"
          >
            Crear cuenta
          </Button>

        </div>
      </div>

      {/* 🔥 AQUÍ VA EL MODAL (DENTRO DEL RETURN) */}
      <FormCrearPerfil
        open={openModal}
        onOpenChange={setOpenModal}
      />
    </div>
  )
}

export default LoginScreen