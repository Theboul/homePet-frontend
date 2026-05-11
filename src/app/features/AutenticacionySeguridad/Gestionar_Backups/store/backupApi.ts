import { api } from '#/store/api/api';
import type { BackupRestore, BackupConfig, PaginatedResponse, BackupFilters } from './backup.types';

export const backupApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getBackups: builder.query<PaginatedResponse<BackupRestore>, BackupFilters>({
      query: (params) => ({
        url: 'auth/backups/',
        params,
      }),
      providesTags: ['Backup'],
    }),

    createBackup: builder.mutation<BackupRestore, { motivo?: string }>({
      query: (data) => ({
        url: 'auth/backups/create/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Backup'],
    }),

    restoreBackup: builder.mutation<{ success: boolean; message: string }, { backup_id: number; motivo: string }>({
      query: ({ backup_id, motivo }) => ({
        url: `auth/backups/${backup_id}/restore/`,
        method: 'POST',
        body: { motivo },
      }),
      invalidatesTags: ['Backup'],
    }),

    getBackupConfig: builder.query<BackupConfig, void>({
      query: () => ({
        url: 'auth/backups/config/',
        method: 'GET',
      }),
      providesTags: ['BackupConfig'],
    }),

    updateBackupConfig: builder.mutation<BackupConfig, Partial<BackupConfig>>({
      query: (data) => ({
        url: 'auth/backups/config/',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['BackupConfig'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetBackupsQuery,
  useCreateBackupMutation,
  useRestoreBackupMutation,
  useGetBackupConfigQuery,
  useUpdateBackupConfigMutation,
} = backupApi;
