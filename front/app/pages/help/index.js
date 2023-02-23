import Head from 'next/head'
import Layout, { siteTitle } from '../../components/layout'

export default function Help() {
  return (
    <Layout help>
      <Head>
        <title>{siteTitle} | HELP</title>
      </Head>
      <section>
        <h1>当アプリについて</h1>
      </section>
    </Layout>
  )
}
