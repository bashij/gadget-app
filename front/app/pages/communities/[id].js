import CommunityDelete from '@/components/communityDelete'
import CommunityMembership from '@/components/communityMembership'
import Layout, { siteTitle } from '@/components/layout'
import Pagination from '@/components/pagination'
import UserFeed from '@/components/userFeed'
import apiClient from '@/utils/apiClient'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { format } from 'date-fns'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import useSWR, { useSWRConfig } from 'swr'

const fetcher = (url) => fetch(url).then((r) => r.json())

export default function Community(props) {
  // サーバーサイドでエラーが発生した場合はエラーメッセージを表示して処理を終了する
  if (props.errorMessage) return props.errorMessage

  const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT_COMMUNITIES
  const [pageIndex, setPageIndex] = useState(1)
  const { mutate } = useSWRConfig()
  const { data, error, isLoading } = useSWR(
    `${API_ENDPOINT}/${props.community.id}/memberships?paged=${pageIndex}`,
    fetcher,
    {
      keepPreviousData: true,
      revalidateOnFocus: false,
    },
  )

  const [membershipCount, setMembershipCount] = useState(props.community.memberships.length)

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
                        props.community.image.url == 'default.jpg'
                          ? '/images/default.jpg'
                          : `https://static.gadgetlink-app.com${props.community.image.url}`
                      }
                      width={150}
                      height={150}
                      alt='community-image'
                      className='card-img-top'
                    />
                  </div>
                </div>
                <div className='community-content'>
                  <table className='table table-sm community-table-detail'>
                    <tbody>
                      <tr>
                        <th>コミュニティ名</th>
                        <td>
                          <p className='overflow'>{props.community.name}</p>
                        </td>
                      </tr>
                      <tr>
                        <th>参加人数</th>
                        <td>
                          <p className='overflow'>
                            <span id={`membership_count_${props.community.id}`}>
                              {membershipCount} 人
                            </span>
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <th>作成者</th>
                        <td>
                          <p className='overflow'>
                            <Image
                              src={
                                props.community.user.image.url == 'default.jpg'
                                  ? '/images/default.jpg'
                                  : `https://static.gadgetlink-app.com${props.community.user.image.url}`
                              }
                              width={50}
                              height={50}
                              alt='user-image'
                            />
                            <Link href={`/users/${props.community.user.id}`}>
                              {props.community.user.name}
                            </Link>
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <th>作成日時</th>
                        <td>
                          <p className='overflow' suppressHydrationWarning>
                            {format(new Date(props.community.created_at), 'yyyy/MM/dd HH:mm')}
                          </p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
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
          <div className='col-12'>
            <div className='content-header'>
              <p>参加中のユーザー</p>
            </div>
            <div id='feed_user'>
              <UserFeed data={data} />
            </div>
          </div>
        </div>
        <div className='pagination'>
          {data && data?.users.length > 0 ? (
            <Pagination data={data} setPageIndex={setPageIndex} />
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
    const responseUser = await apiClient.get('http://back:3000/api/v1/check', {
      headers: {
        cookie: cookie,
      },
    })
    const user = await responseUser.data.user

    // コミュニティ詳細情報を取得
    const id = context.params.id
    const responseCommunity = await apiClient.get(`http://back:3000/api/v1/communities/${id}`, {
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
