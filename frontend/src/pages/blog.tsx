import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { BlogView } from 'src/sections/blog/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
<<<<<<< HEAD
        <title> {`Nodos - ${CONFIG.appName}`}</title>
=======
        <title> {`Graficos - ${CONFIG.appName}`}</title>
>>>>>>> 6a8a80f25d709dae1424d40db78a5fa8b24f9ef9
      </Helmet>

      <BlogView />
    </>
  );
}
