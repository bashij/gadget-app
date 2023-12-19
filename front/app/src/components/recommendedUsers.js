import { useEffect, useState } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/router'

import {
  faArrowCircleRight,
  faBookmark,
  faHeart,
  faReply,
  faUsers,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ToastContainer } from 'react-toastify'
import useSWR from 'swr'

import Pagination from '@/components/pagination'
import UserFeed from '@/components/userFeed'
import UserSearch from '@/components/userSearch'

const fetcher = (url) => fetch(url).then((r) => r.json())

export default function RecommendedUsers(props) {
  const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT_USERS
  const [pageIndex, setPageIndex] = useState(1)

  // 検索条件の初期値
  const getDefaultFilters = () => ({
    name: '',
    job: '',
    sort_condition: '',
  })

  // 検索条件がローカルストレージに保存されている場合はそちらを初期表示する
  const filterName = 'recommendedUserFilters'
  const [filters, setFilters] = useState(() => {
    const storedFilters = typeof window !== 'undefined' && localStorage.getItem(filterName)
    if (storedFilters) {
      return JSON.parse(storedFilters)
    } else {
      return getDefaultFilters()
    }
  })

  const { data, error, isLoading } = useSWR(
    props.user
      ? `${API_ENDPOINT}/${
          props.user.id
        }/recommended_users?paged=${pageIndex}&${new URLSearchParams(filters)}`
      : null,
    fetcher,
    {
      keepPreviousData: true,
    },
  )

  const router = useRouter()
  const [message, setMessage] = useState([router.query.message])
  const [status, setStatus] = useState(router.query.status)

  useEffect(() => {
    if (status === 'notLoggedIn') {
      router.push(
        {
          pathname: '/login',
          query: { message: message, status: status },
        },
        '/login',
      )
    }
  }, [status])

  if (error) return <div>エラーが発生しました。時間をおいて再度お試しください。</div>

  if (data || isLoading) {
    return (
      <>
        <ToastContainer />
        <div className='row justify-content-center'>
          <div className='col-10 text-center'>
            <div className='content-header'>
              <p>あなたにおすすめのユーザー</p>
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
            <div className='icon-container'>
              <p>現在おすすめできるユーザーはいません。</p>
              <p>気になるガジェットに、</p>
              <div className='icons'>
                <div>
                  <span className='icon'>
                    <FontAwesomeIcon icon={faHeart} />
                  </span>
                  <span>いいね</span>
                </div>
                <div>
                  <span className='icon'>
                    <FontAwesomeIcon icon={faBookmark} />
                  </span>
                  <span>ブックマーク</span>
                </div>
                <div>
                  <span className='icon'>
                    <FontAwesomeIcon icon={faUsers} />
                  </span>
                  <span>レビューリクエスト</span>
                </div>
                <div>
                  <span className='icon'>
                    <FontAwesomeIcon icon={faReply} />
                  </span>
                  <span>コメント</span>
                </div>
              </div>
              <p>をしてみてください。</p>
            </div>
          )}
        </div>
        <div className='gadgets-page-link'>
          <Link href='/gadgets'>
            <FontAwesomeIcon className='pe-2' icon={faArrowCircleRight} />
            すべてのガジェットを見る
          </Link>
        </div>
      </>
    )
  }
}
