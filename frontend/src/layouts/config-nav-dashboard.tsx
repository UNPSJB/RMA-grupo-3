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
    path: '/graficos',
    icon: icon('ic-analytics'),
  },
  {
    title: 'Nodos',
    path: '/nodos', 
    icon: icon('nodos'),
    /* info: (
      <Label color="error" variant="inverted">
      +3
      </Label>
    ),  */
  },
  {
    title: 'Usuarios',
    path: '/user', 
    icon: icon('usuario'),
  },
  {
    title: 'Configuración',
    path: '/configuracion', // hacerle una pagina para sacarle el "sign in"
    icon: icon('ajustes'),
  },
  {
    title: 'Regístros históricos',
    path: '/registros_historicos', // acá deberia tener una lista con todos los datos cargados hasta el momento de hacer click.
    icon: icon('documento'),
  },
  /* {
    title: 'No encontrado',
    path: '/404',
    icon: icon('ic-disabled'),
  }, */
];
