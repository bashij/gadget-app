import { useState } from 'react'

import Head from 'next/head'

import useSWR from 'swr'

import Layout, { siteTitle } from '@/components/common/layout'
import Pagination from '@/components/common/pagination'
import UserFeed from '@/components/users/userFeed'
import UserSearch from '@/components/users/userSearch'
import apiClient from '@/utils/apiClient'

const fetcher = (url) => fetch(url).then((r) => r.json())

export default function Following(props) {
  // ログインユーザー自身の詳細ページか判定
  const isMyPage = props.currentUser?.id === props.pageUserId ? true : false

  const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT_USERS
  const [pageIndex, setPageIndex] = useState(1)

  // 検索条件の初期値
  const getDefaultFilters = () => ({
    name: '',
    job: '',
    sort_condition: '',
  })

  // 検索条件がローカルストレージに保存されている場合はそちらを初期表示する
  const filterName = 'followingFilters'
  const [filters, setFilters] = useState(() => {
    const storedFilters = typeof window !== 'undefined' && localStorage.getItem(filterName)
    if (storedFilters) {
      return JSON.parse(storedFilters)
    } else {
      return getDefaultFilters()
    }
  })

  const { data, error, isLoading } = useSWR(
    `${API_ENDPOINT}/${props.pageUserId}/following?paged=${pageIndex}&${new URLSearchParams(
      filters,
    )}`,
    fetcher,
    {
      keepPreviousData: true,
    },
  )

  // サーバーサイドでエラーが発生した場合はエラーメッセージを表示して処理を終了する
  if (props.errorMessage) return props.errorMessage

  if (error) return <div>エラーが発生しました。時間をおいて再度お試しください。</div>

  if (data || isLoading) {
    return (
      <Layout user={props.currentUser} pageName={`${isMyPage ? 'myPage' : ''}`}>
        <Head>
          <title>{siteTitle} | フォロー中</title>
        </Head>
        <div className='row justify-content-center'>
          <div className='col-10 text-center'>
            <div className='content-header'>
              <p>フォロー中</p>
            </div>
            <div className='text-start mt-3'>
              <UserSearch
                filters={filters}
                setFilters={setFilters}
                isLoading={isLoading}
                searchResultCount={data?.searchResultCount}
                setPageIndex={setPageIndex}
                filterName={filterName}
              />
            </div>
            <div className='mt-3'>
              <UserFeed data={data} />
            </div>
          </div>
        </div>
        <div className='pagination'>
          {data && !data.users ? (
            <p>エラーが発生しました。時間をおいて再度お試しください。</p>
          ) : data?.users.length > 0 ? (
            <Pagination data={data} pageIndex={pageIndex} setPageIndex={setPageIndex} />
          ) : isLoading ? (
            <p>データを読み込んでいます...</p>
          ) : (
            <p>フォロー中のユーザーはまだいません</p>
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
