import { useState } from 'react'

import Head from 'next/head'

import useSWR from 'swr'

import Layout, { siteTitle } from '@/components/layout'
import Pagination from '@/components/pagination'
import UserFeed from '@/components/userFeed'
import apiClient from '@/utils/apiClient'


const fetcher = (url) => fetch(url).then((r) => r.json())

export default function Followers(props) {
  // サーバーサイドでエラーが発生した場合はエラーメッセージを表示して処理を終了する
  if (props.errorMessage) return props.errorMessage

  // ログインユーザー自身の詳細ページか判定
  const isMyPage = props.currentUser?.id === props.pageUserId ? true : false

  const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT_USERS
  const [pageIndex, setPageIndex] = useState(1)
  const { data, error, isLoading } = useSWR(
    `${API_ENDPOINT}/${props.pageUserId}/followers?paged=${pageIndex}`,
    fetcher,
    {
      keepPreviousData: true,
    },
  )

  if (error) return <div>エラーが発生しました。時間をおいて再度お試しください。</div>

  if (data || isLoading) {
    return (
      <Layout user={props.currentUser} pageName={`${isMyPage ? 'myPage' : ''}`}>
        <Head>
          <title>{siteTitle} | フォロワー</title>
        </Head>
        <div className='row justify-content-center'>
          <div className='col-10 text-center'>
            <div className='content-header'>
              <p>フォロワー</p>
            </div>
            <div className='mt-3'>
              <UserFeed data={data} />
            </div>
          </div>
        </div>
        <div className='pagination'>
          {data?.users.length > 0 ? (
            <Pagination data={data} pageIndex={pageIndex} setPageIndex={setPageIndex} />
          ) : (
            <p>フォロワーはまだいません</p>
          )}
        </div>
      </Layout>
    )
  }
}

export const getServerSideProps = async (context) => {
  try {
    // ログインユーザー情報を取得
    const cookie = context.req?.headers.cookie
    const responseCurrentUser = await apiClient.get(process.env.API_ENDPOINT_CHECK_SESSION, {
      headers: {
        cookie: cookie,
      },
    })
    const currentUser = await responseCurrentUser.data.user

    // 遷移元ユーザーのIDを取得
    const id = parseFloat(context.params.id)

    return { props: { currentUser: currentUser, pageUserId: id } }
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
