import Layout, { siteTitle } from '@/components/layout'
import Pagination from '@/components/pagination'
import UserFeed from '@/components/userFeed'
import apiClient from '@/utils/apiClient'
import Head from 'next/head'
import { useState } from 'react'

export default function RequestUsers(props) {
  // サーバーサイドでエラーが発生した場合はエラーメッセージを表示して処理を終了する
  if (props.errorMessage) return props.errorMessage

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
  try {
    // ログインユーザー情報を取得
    const cookie = context.req?.headers.cookie
    const responseUser = await apiClient.get(process.env.API_ENDPOINT_CHECK_SESSION, {
      headers: {
        cookie: cookie,
      },
    })
    const user = await responseUser.data.user

    // レビューリクエストしているユーザー詳細情報を取得
    const id = context.params.id
    const responseRequestUsers = await apiClient.get(
      `${process.env.API_ENDPOINT_GADGETS}/${id}/review_requests`,
      {
        headers: {
          cookie: cookie,
        },
      },
    )
    const data = await responseRequestUsers.data

    return { props: { user: user, data: data } }
  } catch (error) {
    // エラーに応じたメッセージを取得する
    let errorMessage = ''

    if (error.response) {
      errorMessage = error.response.errorMessage
    } else if (error.request) {
      errorMessage = error.request.errorMessage
    } else {
      errorMessage = error.errorMessage
    }

    return { props: { errorMessage: errorMessage } }
  }
}
