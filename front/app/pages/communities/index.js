import Community from '@/components/community'
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

export default function Communities(props) {
  // サーバーサイドでエラーが発生した場合はエラーメッセージを表示して処理を終了する
  if (props.errorMessage) return props.errorMessage

  const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT_COMMUNITIES
  const [pageIndex, setPageIndex] = useState(1)
  const { data, error, isLoading } = useSWR(`${API_ENDPOINT}?paged=${pageIndex}`, fetcher, {
    keepPreviousData: true,
  })

  const router = useRouter()
  const [message, setMessage] = useState([router.query.message])
  const [status, setStatus] = useState(router.query.status)

  // コミュニティ削除時
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
  }, [])

  if (error) return <div>エラーが発生しました。時間をおいて再度お試しください。</div>

  if (data || isLoading) {
    return (
      <Layout user={props.user} pageName={'community'}>
        <Head>
          <title>{siteTitle} | コミュニティ</title>
        </Head>
        <ToastContainer />
        <div className='row justify-content-center'>
          <div className='community row justify-content-center mt-3'>
            {data?.communities.map((community) => {
              return <Community key={community.id} community={community} user={props.user} />
            })}
          </div>
        </div>
        <div className='pagination'>
          {data?.communities.length > 0 ? (
            <Pagination data={data} pageIndex={pageIndex} setPageIndex={setPageIndex} />
          ) : (
            <p>登録されているコミュニティはありません</p>
          )}
        </div>
        <div className='new-page-link'>
          <Link href='/communities/new'>
            <FontAwesomeIcon className='pe-2' icon={faCirclePlus} />
            新しいコミュニティを登録する
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
