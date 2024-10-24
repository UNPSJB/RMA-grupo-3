import { Label } from 'src/components/label';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
);

export const navData = [
  {
    title: 'Principal',
    path: '/',
    icon: icon('ic-analytics'),
  },
  {
    title: 'Usuario',
    path: '/user',
    icon: icon('ic-user'),
  },
  {
    title: 'Nodos',
    path: '/products',
    icon: icon('ic-cart'),
    info: (
      <Label color="error" variant="inverted">
        +3
      </Label>
    ), 
  },
  {
    title: 'Gráficos',
    path: '/blog',
    icon: icon('ic-blog'),
  },
  {
    title: 'Configuración',
    path: '/sign-in',
    icon: icon('ic-lock'),
  },
  {
    title: 'Regístros históricos',
    path: '/404', // acá deberia acceder a la base y tener una lista con todos los datos cargados hasta el momento.
    icon: icon('ic-analytics'),
  },
  {
    title: 'No encontrado',
    path: '/404',
    icon: icon('ic-disabled'),
  },
];
