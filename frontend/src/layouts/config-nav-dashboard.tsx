import { Label } from 'src/components/label';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
);

export const navData = [
  /* {
    title: 'Principal',
    path: '/',
    icon: icon('ic-analytics'),
  }, */
  { // NO ENCONTRE DONDE BAJAR LOS BOTONES U_U
    title: '',
    path: '',
    icon: icon(''),
  },
  { 
    title: 'Gráficos',
    path: '/dashboard/graficos',
    icon: icon('ic-analytics'),
  },
  {
    title: 'Nodos',
    path: '/dashboard/nodos', 
    icon: icon('nodos'),
    
  },
  {
    title: 'Regístro histórico',
    path: '/dashboard/registro_historico', 
    icon: icon('documento'),
  },
  {
    title: 'Usuarios',
    path: '/dashboard/user', 
    icon: icon('usuarios'),
  },
  {
    title: 'Configuración',
    path: '/dashboard/configuracion', 
    icon: icon('ajustes'),
  },
  
  /* {
    title: 'No encontrado',
    path: '/404',
    icon: icon('ic-disabled'),
  }, */
];
