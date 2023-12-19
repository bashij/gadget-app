import { useEffect, useState } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/router'

import { faCirclePlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import useSWR from 'swr'

import Pagination from '@/components/common/pagination'
import Community from '@/components/communities/community'

const fetcher = (url) => fetch(url).then((r) => r.json())

export default function UserCommunities(props) {
  const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT_USERS
  const [pageIndex, setPageIndex] = useState(1)
  const { data, error, isLoading } = useSWR(
    `${API_ENDPOINT}/${props.pageUser.id}/user_communities?paged=${pageIndex}`,
    fetcher,
    {
      keepPreviousData: true,
    },
  )

  const router = useRouter()
  const [message, setMessage] = useState([router.query.message])
  const [status, setStatus] = useState(router.query.status)

  // 最新の件数を取得
  const recordCount = data?.pagination?.total_count
  useEffect(() => {
    if (recordCount) {
      props.setUserCommunityCount(recordCount)
    }
  }, [])

  if (error) return <div>エラーが発生しました。時間をおいて再度お試しください。</div>

  if (data || isLoading) {
    return (
      <div>
        <ToastContainer />
        <div className='row justify-content-center'>
          <div className='community row justify-content-center'>
            {data?.communities?.map((community) => {
              return <Community key={community.id} community={community} user={props.currentUser} />
            })}
          </div>
        </div>
        <div className='pagination'>
          {data && !data.communities ? (
            <p>エラーが発生しました。時間をおいて再度お試しください。</p>
          ) : data?.communities.length > 0 ? (
            <Pagination data={data} pageIndex={pageIndex} setPageIndex={setPageIndex} />
          ) : isLoading ? (
            <p>データを読み込んでいます...</p>
          ) : (
            <p>参加しているコミュニティはありません</p>
          )}
        </div>
        {props.isMyPage ? (
          <div className='new-page-link'>
            <Link href='/communities/new'>
              <FontAwesomeIcon className='pe-2' icon={faCirclePlus} />
              新しいコミュニティを登録する
            </Link>
          </div>
        ) : null}
      </div>
    )
  }
}
