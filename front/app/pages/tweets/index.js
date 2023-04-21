import Layout, { siteTitle } from '@/components/layout'
import Pagination from '@/components/pagination'
import Tweet from '@/components/tweet'
import TweetForm from '@/components/tweetForm'
import apiClient from '@/utils/apiClient'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import useSWR, { useSWRConfig } from 'swr'

const fetcher = (url) => fetch(url).then((r) => r.json())

export default function Tweets(props) {
  // サーバーサイドでエラーが発生した場合はエラーメッセージを表示して処理を終了する
  if (props.errorMessage) return props.errorMessage

  const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT_TWEETS
  const [pageIndex, setPageIndex] = useState(1)
  const { mutate } = useSWRConfig()
  const { data, error, isLoading } = useSWR(`${API_ENDPOINT}?paged=${pageIndex}`, fetcher, {
    keepPreviousData: true,
    revalidateOnFocus: false,
  })

  const router = useRouter()
  const [message, setMessage] = useState([router.query.message])
  const [status, setStatus] = useState(router.query.status)
  const [replyFormId, setReplyFormId] = useState()

  useEffect(() => {
    // Statusを初期化
    setStatus()

    if (status === 'success') {
      // フォームを初期化
      replyFormId
        ? document.getElementById(`reply_form_${replyFormId}`)?.reset()
        : document.getElementById('tweet_form')?.reset()
      // ReplyFormIdを初期化
      setReplyFormId()

      // 成功メッセージを表示
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
      <Layout user={props.user} pageName={'tweet'}>
        <Head>
          <title>{siteTitle} | ツイート</title>
        </Head>
        <ToastContainer />
        <div className='row justify-content-center'>
          <div className='col-12 col-lg-10'>
            <div className='switch-area'>
              <Link href='/tweets' className='switch-item active'>
                全てのユーザーを表示
              </Link>
              <Link href='/tweets/followingUsersTweets' className='switch-item'>
                フォロー中のみ表示
              </Link>
            </div>
            <TweetForm
              setMessage={setMessage}
              setStatus={setStatus}
              placeholder={'新しいツイート'}
              mutate={mutate}
              swrKey={`${API_ENDPOINT}?paged=${pageIndex}`}
            />
            <div id='feed_tweet'>
              <div id='tweets' className='posts'>
                {data?.tweets.map((tweet) => {
                  return (
                    <Tweet
                      key={tweet.id}
                      tweet={tweet}
                      user={props.user}
                      replies={data.replies}
                      replyCount={data.replyCounts[tweet.id]}
                      mutate={mutate}
                      swrKey={`${API_ENDPOINT}?paged=${pageIndex}`}
                      setMessage={setMessage}
                      setStatus={setStatus}
                      setReplyFormId={setReplyFormId}
                    />
                  )
                })}
              </div>
            </div>
          </div>
        </div>
        <div className='pagination'>
          {data?.tweets.length > 0 ? (
            <Pagination data={data} pageIndex={pageIndex} setPageIndex={setPageIndex} />
          ) : (
            <p>投稿されているツイートはありません</p>
          )}
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
