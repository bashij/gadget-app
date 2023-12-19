import { useState } from 'react'

import Head from 'next/head'

import useSWR from 'swr'

import Layout, { siteTitle } from '@/components/common/layout'
import Pagination from '@/components/common/pagination'
import UserFeed from '@/components/users/userFeed'
import UserSearch from '@/components/users/userSearch'
import apiClient from '@/utils/apiClient'

const fetcher = (url) => fetch(url).then((r) => r.json())

export default function Users(props) {
  const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT_USERS
  const [pageIndex, setPageIndex] = useState(1)

  // 検索条件の初期値
  const getDefaultFilters = () => ({
    name: '',
    job: '',
    sort_condition: '',
  })

  // 検索条件がローカルストレージに保存されている場合はそちらを初期表示する
  const filterName = 'userFilters'
  const [filters, setFilters] = useState(() => {
    const storedFilters = typeof window !== 'undefined' && localStorage.getItem(filterName)
    if (storedFilters) {
      return JSON.parse(storedFilters)
    } else {
      return getDefaultFilters()
    }
  })

  const { data, error, isLoading } = useSWR(
    `${API_ENDPOINT}?paged=${pageIndex}&${new URLSearchParams(filters)}`,
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
      <Layout user={props.user} pageName={'users'}>
        <Head>
          <title>{siteTitle} | ユーザー一覧</title>
        </Head>
        <div className='row justify-content-center'>
          <div className='col-10 mt-3'>
            <UserSearch
              filters={filters}
              setFilters={setFilters}
              isLoading={isLoading}
              searchResultCount={data?.searchResultCount}
              setPageIndex={setPageIndex}
              filterName={filterName}
            />
          </div>
          <div className='col-10 text-center'>
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
