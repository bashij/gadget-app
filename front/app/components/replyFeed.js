import Reply from '@/components/reply'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'

export default function ReplyFeed(props) {
  const router = useRouter()
  const isInitialRendered = useRef(true)

  const relatedReplies = props.replies?.filter((reply) => reply.parent_id === props.tweet.id)

  const [updatedReplyCount, setUpdatedReplyCount] = useState()
  const [replyCount, setReplyCount] = useState(
    props.replyCount ? props.replyCount : updatedReplyCount,
  )

  const [justPostedTweets, setJustPostedTweets] = useState([])

  const [showReply, setShowReply] = useState(false)

  const handleToggle = () => {
    setShowReply(!showReply)
  }

  useEffect(() => {
    // 初回レンダリング時には実行しない
    if (isInitialRendered.current) {
      isInitialRendered.current = false
      return
    }
    if (props.status === 'notLoggedIn') {
      router.push(
        {
          pathname: '/login',
          query: { message: props.message, status: props.status },
        },
        'login',
      )
    }

    if (props.status === 'success') {
      const newTweets = [...justPostedTweets.reverse(), props.newTweet]
      setJustPostedTweets(newTweets.reverse())
      setReplyCount(props.updatedReplyCount)
    }
  }, [props.status, props.newTweet, props.isDeleted])

  useEffect(() => {
    // 初回レンダリング時には実行しない
    if (isInitialRendered.current) {
      isInitialRendered.current = false
      return
    }

    setReplyCount(updatedReplyCount)
  }, [updatedReplyCount]) // リプライが削除されたときに実行

  useEffect(() => {
    // 初回レンダリング時には実行しない
    if (isInitialRendered.current) {
      isInitialRendered.current = false
      return
    }

    setReplyCount(props.replyCount)
  }, [props.replyCount]) // リプライがh追加されたときに実行

  useEffect(() => {
    // 投稿したツイートとAPIから取得するツイートが重複するため、投稿したツイートを初期化
    setJustPostedTweets([])
  }, [props.data])

  return (
    <>
      <div>
        {replyCount !== undefined && replyCount !== 0 ? (
          <span className='reply-count' onClick={handleToggle}>
            {replyCount}件のリプライ
          </span>
        ) : null}
      </div>
      <div className={`reply-content ${showReply ? 'visible' : 'hidden'}`}>
        {justPostedTweets
          ? justPostedTweets.map((reply, index) => {
              return (
                <Reply
                  key={reply.id}
                  tweet={reply}
                  user={props.user}
                  latest={index === 0 ? true : false}
                  replies={null}
                  replyCounts={null}
                  setUpdatedReplyCount={setUpdatedReplyCount}
                />
              )
            })
          : null}
        {relatedReplies?.map((reply) => {
          return (
            <Reply
              key={reply.id}
              tweet={reply}
              user={props.user}
              replies={null}
              replyCounts={null}
              setUpdatedReplyCount={setUpdatedReplyCount}
            />
          )
        })}
      </div>
    </>
  )
}
