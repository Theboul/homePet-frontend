import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Check, Database, Shield } from 'lucide-react';
import { useState } from 'react';
import { useAppSelector } from '#/store/hooks';
import type { BackupRestore } from '../store/backup.types';
import { useRestoreBackupMutation } from '../store';

interface BackupDetailsModalProps {
  backup: BackupRestore | null;
  onClose: () => void;
  onRestore?: (backup: BackupRestore) => void;
}

export function BackupDetailsModal({ backup, onClose, onRestore }: BackupDetailsModalProps) {
  const [copiedHash, setCopiedHash] = useState(false);
  const [motivo, setMotivo] = useState('Restauración manual');
  const [scope, setScope] = useState<'TENANT' | 'GLOBAL'>('TENANT');
  const [restoreBackup, { isLoading: isRestoring }] = useRestoreBackupMutation();
  const user = useAppSelector((state) => state.auth.user);
  const isSuperuser = user?.is_superuser || false;

  if (!backup) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const estadoColor = {
    'EXITOSO': 'bg-green-100 text-green-800',
    'FALLIDO': 'bg-red-100 text-red-800',
    'INICIADO': 'bg-yellow-100 text-yellow-800',
  };

  return (
    <Dialog open={!!backup} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-[#7C3AED]">Detalle de Copia #{backup.id_backup_restore}</DialogTitle>
          <DialogDescription>Información completa del backup</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 max-h-96 overflow-y-auto">
          {/* Header con estado */}
          <div className="flex items-start justify-between p-3 rounded-lg bg-gray-50 border border-gray-200">
            <div>
              <p className="text-sm font-medium text-gray-700">Estado de la Copia</p>
              <Badge className={`mt-1 ${estadoColor[backup.estado as keyof typeof estadoColor] || 'bg-gray-100'}`}>
                {backup.estado}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Tipo</p>
              <Badge className="mt-1 bg-blue-100 text-blue-800">
                {backup.tipo}
              </Badge>
            </div>
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Fecha y Hora</p>
              <p className="mt-1 text-sm text-black">
                {format(new Date(backup.fecha_hora), 'dd MMMM yyyy HH:mm:ss', { locale: es })}
              </p>
            </div>
          </div>

          {/* Usuario */}
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase">Usuario que realizó la copia</p>
            <div className="mt-1 space-y-1">
              <p className="text-sm text-black font-medium">{backup.usuario_nombre || 'Sistema'}</p>
              <p className="text-xs text-gray-600">{backup.usuario_correo}</p>
            </div>
          </div>

          {/* Almacenamiento */}
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase">Información de Almacenamiento</p>
            <div className="mt-1 space-y-2">
              <div>
                <span className="text-xs text-gray-600">Proveedor: </span>
                <span className="text-sm text-black">{backup.proveedor_almacenamiento}</span>
              </div>
              {backup.ruta_archivo && (
                <div>
                  <span className="text-xs text-gray-600">Ruta: </span>
                  <p className="text-xs text-gray-800 break-all font-mono bg-gray-100 p-2 rounded">
                    {backup.ruta_archivo}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Hash */}
          {backup.hash_archivo && (
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Verificación (SHA-256)</p>
              <div className="mt-1 flex items-center gap-2">
                <code className="flex-1 text-xs text-gray-800 bg-gray-100 p-2 rounded break-all font-mono">
                  {backup.hash_archivo}
                </code>
                <button
                  onClick={() => copyToClipboard(backup.hash_archivo!)}
                  className="p-2 hover:bg-gray-200 rounded transition"
                  title="Copiar hash"
                >
                  {copiedHash ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4 text-gray-600" />
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Motivo */}
          {backup.motivo && (
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Motivo</p>
              <p className="mt-1 text-sm text-gray-800 italic">"{backup.motivo}"</p>
            </div>
          )}

          {/* Mensaje de error si aplica */}
          {backup.estado === 'FALLIDO' && backup.motivo && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200">
              <p className="text-xs font-medium text-red-900 uppercase">Razón del fallo</p>
              <p className="mt-1 text-sm text-red-800">{backup.motivo}</p>
            </div>
          )}
        </div>

        <div className="my-4">
          <label className="text-sm font-medium text-gray-700">Motivo de la restauración (opcional):</label>
          <input
            type="text"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder="Ej: Recuperación por error, pruebas..."
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
            id="restore-reason-modal"
          />
        </div>

        {/* Selector de Scope (solo para superadministradores) */}
        {isSuperuser && (
          <div className="my-4">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Alcance de Restauración
            </label>
            <p className="text-xs text-gray-500 mt-1 mb-3">
              Elige qué datos se restaurarán desde este backup
            </p>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                <input
                  type="radio"
                  name="scope"
                  value="TENANT"
                  checked={scope === 'TENANT'}
                  onChange={(e) => setScope(e.target.value as 'TENANT' | 'GLOBAL')}
                  className="w-4 h-4"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Restaurar Solo Esta Clínica</p>
                  <p className="text-xs text-gray-600">Se restaurarán solo los datos de esta veterinaria (clientes, mascotas, consultas, etc.)</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 border-2 border-red-300 rounded-lg cursor-pointer hover:bg-red-50 transition bg-red-50">
                <input
                  type="radio"
                  name="scope"
                  value="GLOBAL"
                  checked={scope === 'GLOBAL'}
                  onChange={(e) => setScope(e.target.value as 'TENANT' | 'GLOBAL')}
                  className="w-4 h-4"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
                    <Database className="h-4 w-4 text-red-600" />
                    Restaurar Base de Datos Completa
                  </p>
                  <p className="text-xs text-gray-600">⚠️ Se restaurará TODO el sistema incluyendo todas las clínicas. Esta operación es irreversible.</p>
                </div>
              </label>
            </div>
          </div>
        )}

        <div className="flex gap-3 justify-end mt-4">
          <Button variant="ghost" onClick={() => onClose()}>Cerrar</Button>
          <Button
            className={`text-white hover:opacity-90 ${scope === 'GLOBAL' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
            disabled={isRestoring}
            onClick={async () => {
              if (!backup) return;
              try {
                await restoreBackup({ 
                  backup_id: backup.id_backup_restore, 
                  motivo,
                  scope
                }).unwrap();
                if (onRestore) onRestore(backup);
              } catch (err) {
                console.error('Error restaurando desde modal:', err);
              } finally {
                onClose();
              }
            }}
          >
            {isRestoring ? 'Restaurando...' : scope === 'GLOBAL' ? '⚠️ Restaurar Todo' : 'Restaurar'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Nota: se expone onRestore para permitir restaurar directamente desde el modal.
