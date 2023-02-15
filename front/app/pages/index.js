import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import Layout, { siteTitle } from '../components/layout';


export default function Home() {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle} | HOME</title>
      </Head>
      <section>
      </section>
    </Layout>
  )
}
