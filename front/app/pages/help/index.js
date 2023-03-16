import Layout, { siteTitle } from '@/components/layout'
import axios from 'axios'
import Head from 'next/head'

export default function Help(props) {
  return (
    <Layout user={props.user} pageName={'help'}>
      <Head>
        <title>{siteTitle} | HELP</title>
      </Head>
      <section>
        <h1>当アプリについて</h1>
      </section>
    </Layout>
  )
}

export const getServerSideProps = async (context) => {
  const cookie = context.req?.headers.cookie
  const response = await axios.get('http://back:3000/api/v1/check', {
    headers: {
      cookie: cookie,
    },
  })

  const user = await response.data.user

  return { props: { user: user } }
}
