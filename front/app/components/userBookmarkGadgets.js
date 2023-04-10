import Gadget from '@/components/gadget'
import Pagination from '@/components/pagination'
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import useSWR from 'swr'

const fetcher = (url) => fetch(url).then((r) => r.json())

export default function UserBookmarkGadgets(props) {
  const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT_USERS
  const [pageIndex, setPageIndex] = useState(1)
  const { data, error, isLoading } = useSWR(
    `${API_ENDPOINT}/${props.pageUser.id}/user_bookmark_gadgets?paged=${pageIndex}`,
    fetcher,
    {
      keepPreviousData: true,
    },
  )

  // 最新の件数を取得
  const recordCount = data?.pagination.total_count
  useEffect(() => {
    if (recordCount) {
      props.setUserBookmarkGadgetCount(recordCount)
    }
  }, [])

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
        'login',
      )
    }
  }, [status])

  if (error) return <div>failed to load</div>

  if (data || isLoading) {
    return (
      <div>
        <ToastContainer />
        <div className='row justify-content-center'>
          <div className='col-12 col-lg-10'>
            <div id='feed_gadget'>
              <div id='gadgets' className='gadgets'>
                {data?.gadgets.map((gadget) => {
                  return (
                    <Gadget key={gadget.id} gadget={gadget} user={props.currentUser} data={data} />
                  )
                })}
              </div>
            </div>
          </div>
        </div>
        <div className='pagination'>
          {data && data?.gadgets.length > 0 ? (
            <Pagination data={data} pageIndex={pageIndex} setPageIndex={setPageIndex} />
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
