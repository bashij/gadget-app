import Layout, { siteTitle } from '@/components/layout'
import Message from '@/components/message'
import Tweet from '@/components/tweet'
import TweetForm from '@/components/tweetForm'
import axios from 'axios'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import useSWR from 'swr'

const fetcher = (url) => fetch(url).then((r) => r.json())

export default function Tweets(props) {
  const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT_TWEETS
  const [pageIndex, setPageIndex] = useState(1)
  const { data, error, isLoading } = useSWR(`${API_ENDPOINT}?paged=${pageIndex}`, fetcher, {
    keepPreviousData: true,
  })
  const totalPages = data?.pagination.total_pages
  const currentPage = data?.pagination.current_page
  const previousArrow = currentPage > 1 ? currentPage - 1 : currentPage
  const nextArrow = currentPage + 1 <= totalPages ? currentPage + 1 : currentPage

  const [justPostedTweets, setJustPostedTweets] = useState([])

  const router = useRouter()
  const [message, setMessage] = useState([router.query.message])
  const [status, setStatus] = useState(router.query.status)
  const [newTweet, setNewTweet] = useState()
  const isInitialRendered = useRef(true)

  useEffect(() => {
    // 初回レンダリング時には実行しない
    if (isInitialRendered.current) {
      isInitialRendered.current = false
      return
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

    if (status === 'success') {
      const newTweets = [...justPostedTweets.reverse(), newTweet]
      setJustPostedTweets(newTweets.reverse())
      document.getElementById('tweet_form').reset()
    }
  }, [status, newTweet])

  useEffect(() => {
    // 投稿したツイートとAPIから取得するツイートが重複するため、投稿したツイートを初期化
    setJustPostedTweets([])
  }, [data])

  if (error) return <div>failed to load</div>

  if (data || isLoading) {
    return (
      <Layout user={props.user} pageName={'tweet'}>
        <Head>
          <title>{siteTitle} | ツイート</title>
        </Head>
        <div className='row justify-content-center'>
          <div className='col-12 col-lg-10 col-xl-6'>
            <div className='switch-area'>
              <Link href='/tweets' className='switch-item active'>
                全てのユーザーを表示
              </Link>
              <Link href='/tweets' className='switch-item'>
                フォロー中のみ表示
              </Link>
            </div>
            <Message message={message} status={status} />
            {currentPage === 1 ? (
              <TweetForm
                setMessage={setMessage}
                setStatus={setStatus}
                setNewTweet={setNewTweet}
                placeholder={'新しいツイート'}
              />
            ) : null}
            <div id='feed_tweet'>
              <div id='tweets' className='posts'>
                {justPostedTweets
                  ? justPostedTweets.map((tweet, index) => {
                      return (
                        <Tweet
                          key={tweet.id}
                          tweet={tweet}
                          user={props.user}
                          latest={index === 0 ? true : false}
                          replyCounts={{ [tweet.id]: 0 }}
                          data={data}
                        />
                      )
                    })
                  : null}
                {data?.tweets.map((tweet) => {
                  return (
                    <Tweet
                      key={tweet.id}
                      tweet={tweet}
                      user={props.user}
                      replies={data.replies}
                      replyCounts={data.replyCounts}
                      data={data}
                    />
                  )
                })}
              </div>
            </div>
          </div>
        </div>
        <div className='pagination'>
          {/* << 最初のページ */}
          <button className='' onClick={() => setPageIndex(1)}>
            &lt;&lt;
          </button>
          {/* < 前のページ */}
          <button onClick={() => setPageIndex(previousArrow)}>&lt;</button>
          <button
            className={currentPage > 1 ? '' : 'hidden'}
            onClick={() => setPageIndex(pageIndex - 1)}
          >
            {currentPage > 1 ? currentPage - 1 : ''}
          </button>
          {/* 現在のページ */}
          <button className='active'>{currentPage}</button>
          {/* > 次のページ */}
          <button
            className={currentPage + 1 <= totalPages ? '' : 'hidden'}
            onClick={() => setPageIndex(pageIndex + 1)}
          >
            {currentPage + 1 <= totalPages ? currentPage + 1 : ''}
          </button>
          <button onClick={() => setPageIndex(nextArrow)}>&gt;</button>
          {/* >> 最後のページ */}
          <button onClick={() => setPageIndex(totalPages)}>&gt;&gt;</button>
        </div>
      </Layout>
    )
  }
}

export const getServerSideProps = async (context) => {
  const cookie = context.req?.headers.cookie
  const response = await axios.get('http://back:3000/api/v1/check', {
    headers: {
      cookie: cookie,
    },
  })

  const user = await response.data.user

  return { props: { user: user } }
}
