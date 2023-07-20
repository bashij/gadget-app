import { useEffect, useState } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/router'

import { faCirclePlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import useSWR from 'swr'

import Gadget from '@/components/gadget'
import Pagination from '@/components/pagination'

const fetcher = (url) => fetch(url).then((r) => r.json())

export default function UserGadgets(props) {
  const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT_USERS
  const [pageIndex, setPageIndex] = useState(1)
  const { data, error, isLoading } = useSWR(
    `${API_ENDPOINT}/${props.pageUser.id}/user_gadgets?paged=${pageIndex}`,
    fetcher,
    {
      keepPreviousData: true,
    },
  )

  const router = useRouter()
  const [message, setMessage] = useState([router.query.message])
  const [status, setStatus] = useState(router.query.status)

  // ガジェット削除時
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
      <div>
        <ToastContainer />
        <div className='content-header'>
          <p>登録ガジェット({data?.pagination?.total_count})</p>
        </div>
        <div id='feed_gadget'>
          <div id='gadgets' className='gadgets'>
            {data?.gadgets?.map((gadget) => {
              return <Gadget key={gadget.id} gadget={gadget} user={props.currentUser} data={data} />
            })}
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
        {props.isMyPage ? (
          <div className='new-page-link'>
            <Link href='/gadgets/new'>
              <FontAwesomeIcon className='pe-2' icon={faCirclePlus} />
              新しいガジェットを登録する
            </Link>
          </div>
        ) : null}
      </div>
    )
  }
}
