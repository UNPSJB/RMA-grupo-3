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
    title: 'Regístros históricos',
    path: '/dashboard/registros_historicos', // acá deberia tener una lista con todos los datos cargados hasta el momento de hacer click.
    icon: icon('documento'),
  },
  {
    title: 'Usuarios',
    path: '/dashboard/user', 
    icon: icon('usuario'),
  },
  {
    title: 'Configuración',
    path: '/dashboard/configuracion', // hacerle una pagina para sacarle el "sign in"
    icon: icon('ajustes'),
  },
  
  /* {
    title: 'No encontrado',
    path: '/404',
    icon: icon('ic-disabled'),
  }, */
];
