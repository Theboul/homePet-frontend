import { useEffect, useState } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
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

  const search = useSearch({ from: '/_public/login' })

  useEffect(() => {
    if (search.register) {
      setOpenModal(true)
    }
  }, [search.register])

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
    <div className="min-h-screen flex items-center justify-center bg-[#7C3AED] px-4">
      <div className="w-full max-w-md">
        {/* Logo Sección */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-full bg-[#F97316] flex items-center justify-center shadow-lg">
              <Heart className="w-7 h-7 text-white" fill="currentColor" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Pet Home
            </h1>
          </div>
          <p className="text-white/80 text-sm">
            Cuidamos a los que más quieres
          </p>
        </div>

        {/* Tarjeta de Login */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6 border border-white/20">
          <div>
            <h2 className="text-2xl font-bold text-[#7C3AED]">Bienvenido</h2>
            <p className="text-gray-500 text-sm">
              Inicia sesión para continuar
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[#7C3AED]">
                Correo
              </label>
              <Input
                type="email"
                placeholder="correo@pethome.com"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
                className="border-gray-200 focus:ring-[#7C3AED]"
              />
            </div>

            <div className="space-y-1.5 relative">
              <label className="text-sm font-semibold text-[#7C3AED]">
                Contraseña
              </label>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pr-10 border-gray-200 focus:ring-[#7C3AED]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-[#7C3AED] hover:text-[#5b2ab3] transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <Button
              disabled={isLoading}
              className="w-full mt-4 bg-[#F97316] hover:bg-[#EA580C] text-white font-bold h-11 transition-all"
            >
              {isLoading ? 'Verificando...' : 'Entrar'}
            </Button>

            {formError && (
              <p className="text-sm text-red-600" role="alert">
                {formError}
              </p>
            )}
          </form>

          {/* Separador visual */}
          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-xs font-medium uppercase">
              O
            </span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          {/* Botón para abrir Modal manualmente */}
          <Button
            variant="outline"
            onClick={() => setOpenModal(true)}
            className="w-full border-[#7C3AED] text-[#7C3AED] font-bold hover:bg-purple-50 h-11 transition-all"
          >
            Crear cuenta nueva
          </Button>
        </div>
      </div>

      {/* 🔥 AQUÍ VA EL MODAL (DENTRO DEL RETURN) */}
      <FormCrearPerfil open={openModal} onOpenChange={setOpenModal} />
    </div>
  )
}

export default LoginScreen
