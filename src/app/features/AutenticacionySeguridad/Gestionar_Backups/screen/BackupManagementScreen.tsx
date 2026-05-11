import { useState, useMemo } from 'react';
import { useGetBackupsQuery, useCreateBackupMutation, useRestoreBackupMutation, useGetBackupConfigQuery, useUpdateBackupConfigMutation } from '../store';
import { BackupConfigPanel, BackupActionButtons, BackupTable } from '../components';
import type { BackupFilters, BackupRestore } from '../store/backup.types';

export default function BackupManagementScreen() {
  const [filters, setFilters] = useState<BackupFilters>({ page: 1 });
  const [selectedBackup, setSelectedBackup] = useState<BackupRestore | null>(null);

  // Queries
  const { data: backupsData, isLoading: backupsLoading } = useGetBackupsQuery(filters);
  const { data: configData, isLoading: configLoading } = useGetBackupConfigQuery();

  // Mutations
  const [createBackup, { isLoading: isCreatingBackup }] = useCreateBackupMutation();
  const [restoreBackup, { isLoading: isRestoringBackup }] = useRestoreBackupMutation();
  const [updateConfig, { isLoading: isUpdatingConfig }] = useUpdateBackupConfigMutation();

  // Manejadores
  const handleBackupClick = async () => {
    try {
      await createBackup({ motivo: 'Copia de seguridad manual' });
      setFilters({ page: 1 });
    } catch (error) {
      console.error('Error creando backup:', error);
    }
  };

  const handleRestoreClick = async (backup?: BackupRestore | null) => {
    const toRestore = backup ?? selectedBackup;
    if (!toRestore) return;

    const element = document.getElementById('restore-reason') as HTMLInputElement;
    const motivo = element?.value || 'Restauración manual';

    try {
      await restoreBackup({ backup_id: toRestore.id_backup_restore, motivo });
      setSelectedBackup(null);
    } catch (error) {
      console.error('Error restaurando backup:', error);
    }
  };

  const handleConfigSave = async (data: any) => {
    try {
      await updateConfig(data);
    } catch (error) {
      console.error('Error actualizando configuración:', error);
    }
  };

  const totalPages = useMemo(() => {
    if (!backupsData?.count) return 1;
    return Math.ceil(backupsData.count / 10);
  }, [backupsData?.count]);

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Encabezado */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Gestión de Copias de Seguridad</h1>
        <p className="text-gray-500 mt-1">
          Administra tus copias de seguridad, configura la automatización y restaura desde versiones anteriores.
        </p>
      </div>

      {/* Panel de Configuración */}
      <BackupConfigPanel
        config={configData}
        isLoading={configLoading}
        onSave={handleConfigSave}
        isSaving={isUpdatingConfig}
      />

      {/* Sección de Acciones */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Acciones Rápidas</h2>
        <BackupActionButtons
          onBackupClick={handleBackupClick}
          onRestoreClick={handleRestoreClick}
          isBackupLoading={isCreatingBackup}
          isRestoreLoading={isRestoringBackup}
          selectedBackupId={selectedBackup?.id_backup_restore}
          allowRestore={true} // TODO: verificar permisos del usuario
        />
      </div>

      {/* Historial de Copias */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Historial de Copias</h2>
        <BackupTable
          data={backupsData?.results || []}
          isLoading={backupsLoading}
          page={filters.page || 1}
          totalPages={totalPages}
          hasNext={!!backupsData?.next}
          hasPrevious={!!backupsData?.previous}
          onPageChange={(newPage) => setFilters((prev) => ({ ...prev, page: newPage }))}
          onSelectBackup={setSelectedBackup}
          onRestore={handleRestoreClick}
        />
      </div>
    </div>
  );
}
