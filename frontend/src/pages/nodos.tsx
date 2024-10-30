import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { NodoView } from 'src/sections/product/view'; // import { NodoView } from 'src/sections/product/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Nodos - ${CONFIG.appName}`}</title>
      </Helmet>

      <NodoView />
    </>
  );
}
