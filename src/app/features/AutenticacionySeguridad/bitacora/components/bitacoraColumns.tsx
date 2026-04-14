import { createColumnHelper } from '@tanstack/react-table';
import type { Bitacora } from '../store/bitacora.types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Eye, Globe } from 'lucide-react';
import { Button } from '#/components/ui/button';

const columnHelper = createColumnHelper<Bitacora>();

export const getBitacoraColumns = (onViewDetails: (bitacora: Bitacora) => void) => [
  columnHelper.accessor('fecha_hora', {
    header: 'Fecha y Hora',
    cell: (info) => (
      <span className="whitespace-nowrap">
        {format(new Date(info.getValue()), "dd MMM yyyy, HH:mm", { locale: es })}
      </span>
    ),
  }),
  columnHelper.accessor('usuario_nombre', {
    header: 'Usuario Actor',
    cell: (info) => <span className="font-medium">{info.getValue()}</span>,
  }),
  columnHelper.accessor('ip', {
    header: 'Dirección IP',
    cell: (info) => {
      const ip = info.getValue();
      return (
        <div className="flex items-center gap-1.5 text-slate-600 font-mono text-xs">
          {ip ? (
            <>
              <Globe className="h-3.5 w-3.5 text-slate-400" />
              {ip}
            </>
          ) : (
            <span className="text-slate-400 italic font-sans">N/D</span>
          )}
        </div>
      );
    },
  }),
  columnHelper.accessor('modulo_display', {
    header: 'Módulo',
    cell: (info) => (
      <span className="inline-flex rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor('accion_display', {
    header: 'Acción',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('descripcion', {
    header: 'Descripción',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('resultado_display', {
    header: 'Resultado',
    cell: (info) => {
      const isExito = info.getValue() === 'Éxito';
      return (
        <span className={`font-bold ${isExito ? 'text-green-600' : 'text-red-500'}`}>
          {info.getValue()}
        </span>
      );
    },
  }),
  columnHelper.display({
    id: 'acciones',
    header: () => <div className="text-right">Detalles</div>,
    cell: (info) => (
      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          className="text-[#F97316] hover:text-[#EA580C] hover:bg-orange-50"
          onClick={() => onViewDetails(info.row.original)}
          title="Ver todos los detalles"
        >
          <Eye className="h-4 w-4" />
        </Button>
      </div>
    ),
  }),
];