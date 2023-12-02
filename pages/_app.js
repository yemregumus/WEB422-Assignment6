import "bootstrap/dist/css/bootstrap.min.css";
import "@/styles/globals.css";
import { Container, Nav, Navbar } from "react-bootstrap";
import React from "react";
import Link from "next/link";
import Layout from "./components/Layout";
import { SWRConfig } from "swr";
import RouteGuard from './components/RouteGuard'

export default function App({ Component, pageProps }) {
  return (
    <>

      <Layout>
      
        <SWRConfig
          value={{
            fetcher: async (url) => {
              const res = await fetch(url);

              // If the status code is not in the range 200-299,
              // we still try to parse and throw it.
              if (!res.ok) {
                const error = new Error("An error occurred while fetching the data.");
                // Attach extra info to the error object.
                error.info = await res.json();
                error.status = res.status;
                throw error;
              }
              return res.json();
            },
          }}
        >
          <RouteGuard>
            <Component {...pageProps} />
            </RouteGuard>
        </SWRConfig>
        
      </Layout>
    </>
  );
}
