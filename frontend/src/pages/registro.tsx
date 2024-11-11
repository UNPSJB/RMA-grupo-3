import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { RegistroView } from 'src/sections/registro_historico/view'; // import { NodoView } from 'src/sections/product/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Registro Historico - ${CONFIG.appName}`}</title>
      </Helmet>

      <RegistroView />
    </>
  );
}