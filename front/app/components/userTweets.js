import Pagination from '@/components/pagination'
import Tweet from '@/components/tweet'
import { useEffect, useState } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import useSWR, { useSWRConfig } from 'swr'

const fetcher = (url) => fetch(url).then((r) => r.json())

export default function UserTweets(props) {
  const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT_USERS
  const [pageIndex, setPageIndex] = useState(1)
  const { mutate } = useSWRConfig()
  const { data, error, isLoading } = useSWR(
    `${API_ENDPOINT}/${props.pageUser.id}/user_tweets?paged=${pageIndex}`,
    fetcher,
    {
      keepPreviousData: true,
    },
  )

  // 最新の件数を取得
  const recordCount = data?.pagination.total_count
  useEffect(() => {
    if (recordCount) {
      props.setUserTweetCount(recordCount)
    }
  }, [])

  if (error) return <div>エラーが発生しました。時間をおいて再度お試しください。</div>

  if (data || isLoading) {
    return (
      <div>
        <ToastContainer />
        <div className='row justify-content-center'>
          <div className='col-12 col-lg-10'>
            <div id='feed_tweet'>
              <div id='tweets' className='posts'>
                {data?.tweets.map((tweet) => {
                  return (
                    <Tweet
                      key={tweet.id}
                      tweet={tweet}
                      user={props.currentUser}
                      replies={data.replies}
                      replyCount={data.replyCounts[tweet.id]}
                      mutate={mutate}
                      swrKey={`${API_ENDPOINT}/${props.pageUser.id}/user_tweets?paged=${pageIndex}`}
                      setMessage={props.setMessage}
                      setStatus={props.setStatus}
                      setReplyFormId={props.setReplyFormId}
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
      </div>
    )
  }
}
