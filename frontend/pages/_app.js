import NextNProgress from "nextjs-progressbar";
import { Provider } from "react-redux";
import SimpleReactLightbox from "simple-react-lightbox";

import Layout from "../components/Layout";
import { useStore } from "../store";
import "../styles/globals.css";
import "react-modern-calendar-datepicker/lib/DatePicker.css";

function MyApp({ Component, pageProps }) {
  const store = useStore(pageProps.initialReduxState);
  return (
    <Provider store={store}>
      <SimpleReactLightbox>
        <NextNProgress color="#00a9c7" />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SimpleReactLightbox>
    </Provider>
  );
}

export default MyApp;
