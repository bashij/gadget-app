import Layout, { siteTitle } from '@/components/layout'
import Pagination from '@/components/pagination'
import UserFeed from '@/components/userFeed'
import axios from 'axios'
import Head from 'next/head'
import { useState } from 'react'

export default function RequestUsers(props) {
  const [pageIndex, setPageIndex] = useState(1)

  return (
    <Layout user={props.user} pageName={'gadget'}>
      <Head>
        <title>{siteTitle} | リクエストユーザー一覧</title>
      </Head>
      <div className='row justify-content-center'>
        <div className='col-12'>
          <div className='content-header'>
            <p>レビューリクエストしているユーザー</p>
          </div>
          <div id='feed_user'>
            <UserFeed data={props.data} />
          </div>
        </div>
      </div>
      <div className='pagination'>
        {props.data && props.data?.users.length > 0 ? (
          <Pagination data={props.data} setPageIndex={setPageIndex} />
        ) : (
          <p>レビューリクエストしているユーザーはまだいません</p>
        )}
      </div>
    </Layout>
  )
}

export const getServerSideProps = async (context) => {
  // ログインユーザー情報を取得
  const cookie = context.req?.headers.cookie
  const responseUser = await axios.get('http://back:3000/api/v1/check', {
    headers: {
      cookie: cookie,
    },
  })
  const user = await responseUser.data.user

  // レビューリクエストしているユーザー詳細情報を取得
  const id = context.params.id
  const responseRequestUsers = await axios.get(
    `http://back:3000/api/v1/gadgets/${id}/review_requests`,
    {
      headers: {
        cookie: cookie,
      },
    },
  )
  const data = await responseRequestUsers.data

  return { props: { user: user, data: data } }
}