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

import Gadget from '@/components/gadget'
import GadgetSearch from '@/components/gadgetSearch'
import Pagination from '@/components/pagination'

import 'react-toastify/dist/ReactToastify.css'

const fetcher = (url) => fetch(url).then((r) => r.json())

export default function RecommendedGadgets(props) {
  const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT_USERS
  const [pageIndex, setPageIndex] = useState(1)

  // 検索条件の初期値
  const getDefaultFilters = () => ({
    name: '',
    category: '',
    model_number: '',
    manufacturer: '',
    price_minimum: '',
    price_maximum: '',
    other_info: '',
    review: '',
    sort_condition: '',
  })

  // 検索条件がローカルストレージに保存されている場合はそちらを初期表示する
  const filterName = 'recommendedGadgetFilters'
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
        }/recommended_gadgets?paged=${pageIndex}&${new URLSearchParams(filters)}`
      : null,
    fetcher,
    {
      keepPreviousData: true,
      revalidateOnFocus: false,
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
          <div className='col-12 col-lg-10'>
            <div className='content-header'>
              <p className='text-center'>あなたにおすすめのガジェット</p>
            </div>
            <GadgetSearch
              filters={filters}
              setFilters={setFilters}
              isLoading={isLoading}
              searchResultCount={data?.searchResultCount}
              setPageIndex={setPageIndex}
              filterName={filterName}
            />
            <div id='feed_gadget'>
              <div id='gadgets' className='gadgets'>
                {data?.gadgets?.map((gadget) => {
                  return <Gadget key={gadget.id} gadget={gadget} user={props.user} data={data} />
                })}
              </div>
            </div>
          </div>
        </div>
        <div className='pagination'>
          {data && !data.gadgets ? (
            <p>エラーが発生しました。時間をおいて再度お試しください。</p>
          ) : data?.gadgets.length > 0 ? (
            <Pagination data={data} pageIndex={pageIndex} setPageIndex={setPageIndex} />
          ) : isLoading ? (
            <p>データを読み込んでいます...</p>
          ) : (
            <div className='icon-container'>
              <p>現在おすすめできるガジェットはありません。</p>
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
