import { useEffect, useState } from 'react'

import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { faCirclePlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { toast, ToastContainer } from 'react-toastify'
import useSWR from 'swr'

import Gadget from '@/components/gadget'
import GadgetSearch from '@/components/gadgetSearch'
import Layout, { siteTitle } from '@/components/layout'
import Pagination from '@/components/pagination'
import apiClient from '@/utils/apiClient'

import 'react-toastify/dist/ReactToastify.css'

const fetcher = (url) => fetch(url).then((r) => r.json())

export default function FollowingUsersGadgets(props) {
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
  const [filters, setFilters] = useState(() => {
    const storedFilters = typeof window !== 'undefined' && localStorage.getItem('filters')
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
        }/following_users_gadgets?paged=${pageIndex}&${new URLSearchParams(filters)}`
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

  // ガジェット削除時
  useEffect(() => {
    if (status === 'success') {
      toast.success(`${message}`.replace(/,/g, '\n'), {
        position: 'top-center',
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        className: 'toast-message',
      })
    }

    // 非ログイン時はログイン画面へ遷移
    if (!props.errorMessage && !props.user) {
      router.push(
        {
          pathname: '/login',
          query: { message: 'ログインしてください', status: 'notLoggedIn' },
        },
        '/login',
      )
    }

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

  // サーバーサイドでエラーが発生した場合はエラーメッセージを表示して処理を終了する
  if (props.errorMessage) return props.errorMessage

  if (error) return <div>エラーが発生しました。時間をおいて再度お試しください。</div>

  if (data || isLoading) {
    return (
      <Layout user={props.user} pageName={'gadget'}>
        <Head>
          <title>{siteTitle} | ガジェット</title>
        </Head>
        <ToastContainer />
        <div className='row justify-content-center'>
          <div className='col-12 col-lg-10'>
            <div className='switch-area'>
              <Link href='/gadgets' className='switch-item'>
                全てのユーザーを表示
              </Link>
              <Link href='/gadgets/followingUsersGadgets' className='switch-item active'>
                フォロー中のみ表示
              </Link>
            </div>
            <GadgetSearch
              filters={filters}
              setFilters={setFilters}
              isLoading={isLoading}
              searchResultCount={data?.searchResultCount}
              setPageIndex={setPageIndex}
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
            <p>登録されているガジェットはありません</p>
          )}
        </div>
        <div className='new-page-link'>
          <Link href='/gadgets/new'>
            <FontAwesomeIcon className='pe-2' icon={faCirclePlus} />
            新しいガジェットを登録する
          </Link>
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
