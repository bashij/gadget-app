import Community from '@/components/community'
import Layout, { siteTitle } from '@/components/layout'
import axios from 'axios'
import Head from 'next/head'
import { useState } from 'react'
import useSWR from 'swr'

const fetcher = (url) => fetch(url).then((r) => r.json())

export default function Communities(props) {
  const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT_COMMUNITIES
  const [pageIndex, setPageIndex] = useState(1)
  const { data, error, isLoading } = useSWR(`${API_ENDPOINT}?paged=${pageIndex}`, fetcher, {
    keepPreviousData: true,
  })
  const totalPages = data?.pagination.total_pages
  const currentPage = data?.pagination.current_page
  const previousArrow = currentPage > 1 ? currentPage - 1 : currentPage
  const nextArrow = currentPage + 1 <= totalPages ? currentPage + 1 : currentPage

  if (error) return <div>failed to load</div>

  if (data || isLoading) {
    return (
      <Layout user={props.user} pageName={'community'}>
        <Head>
          <title>{siteTitle} | コミュニティ</title>
        </Head>
        <div className='row justify-content-center'>
          <div className='community row justify-content-center mt-3 mb-3'>
            {data?.communities.map((community) => {
              return <Community key={community.id} community={community} user={props.user} />
            })}
          </div>
        </div>
        <div className='pagination'>
          {/* << 最初のページ */}
          <button className='' onClick={() => setPageIndex(1)}>
            &lt;&lt;
          </button>
          {/* < 前のページ */}
          <button onClick={() => setPageIndex(previousArrow)}>&lt;</button>
          <button
            className={currentPage > 1 ? '' : 'hidden'}
            onClick={() => setPageIndex(pageIndex - 1)}
          >
            {currentPage > 1 ? currentPage - 1 : ''}
          </button>
          {/* 現在のページ */}
          <button className='active'>{currentPage}</button>
          {/* > 次のページ */}
          <button
            className={currentPage + 1 <= totalPages ? '' : 'hidden'}
            onClick={() => setPageIndex(pageIndex + 1)}
          >
            {currentPage + 1 <= totalPages ? currentPage + 1 : ''}
          </button>
          <button onClick={() => setPageIndex(nextArrow)}>&gt;</button>
          {/* >> 最後のページ */}
          <button onClick={() => setPageIndex(totalPages)}>&gt;&gt;</button>
        </div>
      </Layout>
    )
  }
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
