import Layout, { siteTitle } from '@/components/layout'
import Pagination from '@/components/pagination'
import UserFeed from '@/components/userFeed'
import axios from 'axios'
import Head from 'next/head'
import { useState } from 'react'
import useSWR from 'swr'

const fetcher = (url) => fetch(url).then((r) => r.json())

export default function Followers(props) {
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

  if (error) return <div>failed to load</div>

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
  // ログインユーザー情報を取得
  const cookie = context.req?.headers.cookie
  const responseCurrentUser = await axios.get('http://back:3000/api/v1/check', {
    headers: {
      cookie: cookie,
    },
  })
  const currentUser = await responseCurrentUser.data.user

  // 遷移元ユーザーのIDを取得
  const id = parseFloat(context.params.id)

  return { props: { currentUser: currentUser, pageUserId: id } }
}
