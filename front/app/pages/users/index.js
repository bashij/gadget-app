import Head from 'next/head'
import Image from 'next/image'
import Layout, { siteTitle } from '../../components/layout'
import React, { useState } from 'react'
import useSWR from 'swr'

const fetcher = (url) => fetch(url).then((r) => r.json())

export default function Users() {
  const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT_USERS
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
      <Layout>
        <Head>
          <title>{siteTitle} | ユーザー一覧</title>
        </Head>
        <div className='row justify-content-center'>
          <div className='col-10 text-center'>
            {data?.users.map((user) => {
              return (
                <div key={user.id} className='user-feed p-3 m-1'>
                  <div className='user-info text-center me-2'>
                    <Image
                      src={
                        user.image.url == 'default.jpg'
                          ? '/images/default.jpg'
                          : `https://static.gadgetlink-app.com${user.image.url}`
                      }
                      width={150}
                      height={150}
                      alt='user-image'
                    />
                    <div className='user mt-2'>{user.name}</div>
                  </div>
                </div>
              )
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
