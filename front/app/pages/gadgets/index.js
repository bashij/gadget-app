import Gadget from '@/components/gadget'
import Layout, { siteTitle } from '@/components/layout'
import Pagination from '@/components/pagination'
import apiClient from '@/utils/apiClient'
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import useSWR from 'swr'

const fetcher = (url) => fetch(url).then((r) => r.json())

export default function Gadgets(props) {
  // サーバーサイドでエラーが発生した場合はエラーメッセージを表示して処理を終了する
  if (props.errorMessage) return props.errorMessage

  const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT_GADGETSa
  const [pageIndex, setPageIndex] = useState(1)
  const { data, error, isLoading } = useSWR(`${API_ENDPOINT}?paged=${pageIndex}`, fetcher, {
    keepPreviousData: true,
    revalidateOnFocus: false,
  })

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

    if (status === 'notLoggedIn') {
      router.push(
        {
          pathname: '/login',
          query: { message: message, status: status },
        },
        'login',
      )
    }
  }, [status])

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
              <Link href='/gadgets' className='switch-item active'>
                全てのユーザーを表示
              </Link>
              <Link href='/gadgets/followingUsersGadgets' className='switch-item'>
                フォロー中のみ表示
              </Link>
            </div>
            <div id='feed_gadget'>
              <div id='gadgets' className='gadgets'>
                {data?.gadgets.map((gadget) => {
                  return <Gadget key={gadget.id} gadget={gadget} user={props.user} data={data} />
                })}
              </div>
            </div>
          </div>
        </div>
        <div className='pagination'>
          {data && data?.gadgets.length > 0 ? (
            <Pagination data={data} setPageIndex={setPageIndex} />
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
    const response = await apiClient.get('http://back:3000/api/v1/check', {
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
