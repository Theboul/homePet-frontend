import { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Save, AlertCircle } from 'lucide-react';
import type { BackupConfig } from '../store/backup.types';

interface BackupConfigPanelProps {
  config: BackupConfig | undefined;
  isLoading: boolean;
  onSave: (data: Partial<BackupConfig>) => void;
  isSaving: boolean;
}

export function BackupConfigPanel({
  config,
  isLoading,
  onSave,
  isSaving,
}: BackupConfigPanelProps) {
  const [frecuencia, setFrecuencia] = useState<string>(config?.frecuencia || 'SEMANAL');
  const [diasRetention, setDiasRetention] = useState<number>(config?.dias_retención || 30);

  const handleSave = () => {
    onSave({
      frecuencia: frecuencia as 'DIARIO' | 'SEMANAL' | 'MENSUAL' | 'PERSONALIZADO',
      dias_retención: diasRetention,
    });
  };

  const hasChanges = 
    frecuencia !== config?.frecuencia || 
    diasRetention !== config?.dias_retención;

  return (
    <Card className="border-[#7C3AED] bg-gradient-to-br from-white to-purple-50">
      <CardHeader>
        <CardTitle className="text-[#7C3AED]">Configuración de Copias Automáticas</CardTitle>
        <CardDescription>
          Define la frecuencia y política de retención de tus copias de seguridad automáticas
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Frecuencia */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Frecuencia de Copia Automática</label>
          <Select value={frecuencia} onValueChange={setFrecuencia} disabled={isLoading}>
            <SelectTrigger className="bg-white border-gray-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DIARIO">Diario (cada 24 horas)</SelectItem>
              <SelectItem value="SEMANAL">Semanal (cada 7 días)</SelectItem>
              <SelectItem value="MENSUAL">Mensual (cada 30 días)</SelectItem>
              <SelectItem value="PERSONALIZADO">Personalizado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Días de Retención */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Días de Retención</label>
          <div className="flex gap-3 items-center">
            <input
              type="number"
              min="1"
              max="365"
              value={diasRetention}
              onChange={(e) => setDiasRetention(Math.max(1, Math.min(365, parseInt(e.target.value) || 30)))}
              disabled={isLoading}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white text-black"
            />
            <span className="text-sm text-gray-600">días</span>
          </div>
          <p className="text-xs text-gray-500">
            Las copias más antiguas se eliminarán automáticamente
          </p>
        </div>

        {/* Información del Próximo Backup */}
        {config?.próximo_backup_programado && (
          <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 space-y-1">
            <div className="flex items-center gap-2 text-blue-900">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">Próxima copia programada</span>
            </div>
            <p className="text-sm text-blue-800 ml-6">
              {format(new Date(config.próximo_backup_programado), 'dd MMMM yyyy HH:mm', {
                locale: es,
              })}
            </p>
          </div>
        )}

        {/* Última Copia */}
        {config?.último_backup && (
          <div className="rounded-lg bg-green-50 border border-green-200 p-3 space-y-1">
            <div className="flex items-center gap-2 text-green-900">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Última copia realizada</span>
            </div>
            <p className="text-sm text-green-800 ml-6">
              {format(new Date(config.último_backup), 'dd MMMM yyyy HH:mm', {
                locale: es,
              })}
            </p>
          </div>
        )}

        {/* Botones de Acción */}
        <div className="flex gap-3 pt-4">
          <Button
            onClick={handleSave}
            disabled={!hasChanges || isSaving || isLoading}
            className="bg-[#F97316] text-white hover:bg-[#EA580C]"
          >
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
          </Button>

          {!hasChanges && (
            <p className="text-sm text-gray-500 self-center">Sin cambios</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
