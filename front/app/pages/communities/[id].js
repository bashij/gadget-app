import { useEffect, useRef, useState } from 'react'

import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { toast, ToastContainer } from 'react-toastify'
import useSWR, { useSWRConfig } from 'swr'

import CommunityDelete from '@/components/communityDelete'
import CommunityDetail from '@/components/communityDetail'
import CommunityMembership from '@/components/communityMembership'
import Layout, { siteTitle } from '@/components/layout'
import Pagination from '@/components/pagination'
import UserFeed from '@/components/userFeed'
import apiClient from '@/utils/apiClient'
import 'react-toastify/dist/ReactToastify.css'

const fetcher = (url) => fetch(url).then((r) => r.json())

export default function Community(props) {
  const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT_COMMUNITIES
  const [pageIndex, setPageIndex] = useState(1)
  const { mutate } = useSWRConfig()
  const { data, error, isLoading } = useSWR(
    `${API_ENDPOINT}/${props.community?.id}/memberships?paged=${pageIndex}`,
    fetcher,
    {
      keepPreviousData: true,
      revalidateOnFocus: false,
    },
  )

  const [membershipCount, setMembershipCount] = useState(props.community?.memberships.length)

  const router = useRouter()
  const [message, setMessage] = useState([router.query.message])
  const [status, setStatus] = useState(router.query.status)

  // コミュニティ新規作成時
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

  // コミュニティ削除時
  const isInitialRendered = useRef(true)
  useEffect(() => {
    // 初回レンダリング時には実行しない
    if (isInitialRendered.current) {
      isInitialRendered.current = false
      return
    }

    // コミュニティ削除完了後は一覧へ遷移
    if (status === 'success') {
      router.push(
        {
          pathname: `/communities`,
          query: { message: message, status: status },
        },
        `/communities/`,
      )
      setMessage([])
      setStatus()
    }

    // 失敗メッセージを表示
    if (status === 'failure') {
      toast.error(`${message}`.replace(/,/g, '\n'), {
        position: 'top-center',
        autoClose: 8000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        className: 'toast-message',
      })
    }
  }, [status])

  // サーバーサイドでエラーが発生した場合はエラーメッセージを表示して処理を終了する
  if (props.errorMessage) return props.errorMessage

  if (error) return <div>エラーが発生しました。時間をおいて再度お試しください。</div>

  if (data || isLoading) {
    return (
      <Layout user={props.user} pageName={'community'}>
        <Head>
          <title>
            {siteTitle} | {props.community.name}
          </title>
        </Head>
        <ToastContainer />
        <div className='row justify-content-center'>
          <div className='col-12 col-xl-10'>
            <div id={`community_${props.community.id}`}>
              <div className='community-detail'>
                <div className='community-image-detail'>
                  <div>
                    <Image
                      src={
                        props.community.image.url === 'default.jpg'
                          ? '/images/default.jpg'
                          : props.community.image.url
                      }
                      width={150}
                      height={150}
                      alt='community-image'
                      className='card-img-top'
                    />
                  </div>
                </div>
                <div className='community-content'>
                  <CommunityDetail community={props.community} membershipCount={membershipCount} />
                  {props.user && props.community.user_id === props.user.id ? (
                    <div className='edit-links'>
                      <div className='link-section'>
                        <Link href={`/communities/${props.community.id}/edit`}>
                          <FontAwesomeIcon icon={faPenToSquare} />
                          コミュニティを編集
                        </Link>
                      </div>
                      <CommunityDelete
                        community={props.community}
                        setMessage={setMessage}
                        setStatus={setStatus}
                      />
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
          <CommunityMembership
            community={props.community}
            user={props.user}
            setMembershipCount={setMembershipCount}
            mutate={mutate}
            swrKey={`${API_ENDPOINT}/${props.community.id}/memberships?paged=${pageIndex}`}
          />
        </div>
        <div className='row justify-content-center'>
          <div className='col-12 text-center'>
            <div className='content-header'>
              <p>参加中のユーザー</p>
            </div>
            <div id='feed_user'>
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
            <p>参加中のユーザーはまだいません</p>
          )}
        </div>
      </Layout>
    )
  }
}

export const getServerSideProps = async (context) => {
  try {
    // ログインユーザー情報を取得
    const cookie = context.req?.headers.cookie
    const responseUser = await apiClient.get(process.env.API_ENDPOINT_CHECK_SESSION, {
      headers: {
        cookie: cookie,
      },
    })
    const user = await responseUser.data.user

    // コミュニティ詳細情報を取得
    const id = context.params.id
    const responseCommunity = await apiClient.get(`${process.env.API_ENDPOINT_COMMUNITIES}/${id}`, {
      headers: {
        cookie: cookie,
      },
    })
    const community = await responseCommunity.data.community

    return { props: { user: user, community: community } }
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
