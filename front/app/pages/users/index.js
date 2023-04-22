import Layout, { siteTitle } from '@/components/layout'
import Pagination from '@/components/pagination'
import UserFeed from '@/components/userFeed'
import apiClient from '@/utils/apiClient'
import Head from 'next/head'
import { useState } from 'react'
import useSWR from 'swr'

const fetcher = (url) => fetch(url).then((r) => r.json())

export default function Users(props) {
  // サーバーサイドでエラーが発生した場合はエラーメッセージを表示して処理を終了する
  if (props.errorMessage) return props.errorMessage

  const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT_USERS
  const [pageIndex, setPageIndex] = useState(1)
  const { data, error, isLoading } = useSWR(`${API_ENDPOINT}?paged=${pageIndex}`, fetcher, {
    keepPreviousData: true,
  })

  if (error) return <div>エラーが発生しました。時間をおいて再度お試しください。</div>

  if (data || isLoading) {
    return (
      <Layout user={props.user} pageName={'users'}>
        <Head>
          <title>{siteTitle} | ユーザー一覧</title>
        </Head>
        <div className='row justify-content-center'>
          <div className='col-10 text-center'>
            <div className='mt-3'>
              <UserFeed data={data} />
            </div>
          </div>
        </div>
        <div className='pagination'>
          {data?.users.length > 0 ? (
            <Pagination data={data} pageIndex={pageIndex} setPageIndex={setPageIndex} />
          ) : (
            <p>登録されているユーザーはまだいません</p>
          )}
        </div>
      </Layout>
    )
  }
}

export const getServerSideProps = async (context) => {
  try {
    const cookie = context.req?.headers.cookie
    const response = await apiClient.get(process.env.API_ENDPOINT_CHECK_SESSION, {
      headers: {
        cookie: cookie,
      },
    })

    const user = await response.data.user

    return { props: { user: user } }
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
