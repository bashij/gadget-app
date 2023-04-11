import ReplyTweet from '@/components/replyTweet'
import TweetBookmark from '@/components/tweetBookmark'
import TweetDelete from '@/components/tweetDelete'
import TweetForm from '@/components/tweetForm'
import TweetLike from '@/components/tweetLike'
import { faReply } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { ja } from 'date-fns/locale'
import Image from 'next/image'
import Link from 'next/link'
import { useRef, useState } from 'react'

export default function Tweet(props) {
  const relatedReplies = props.replies?.filter((reply) => reply.parent_id === props.tweet.id)

  const [isOpen, setIsOpen] = useState(false)
  const replyRef = useRef(null)
  const [replyHeight, setReplyHeight] = useState(0)

  const toggleAccordion = () => {
    if (!isOpen) {
      setReplyHeight(replyRef.current.scrollHeight)
    }
    setIsOpen(!isOpen)
  }

  const replyStyle = {
    height: isOpen ? replyHeight : 0,
  }

  const [showReply, setShowReply] = useState(false)
  const handleToggle = () => {
    setShowReply(!showReply)
  }

  return (
    <div className='parent-post'>
      <div className='post' id={`tweet_${props.tweet.id}`}>
        <div className='tweet-section-left'>
          <div className='user-info'>
            <Image
              src={
                props.tweet.user.image.url == 'default.jpg'
                  ? '/images/default.jpg'
                  : `https://static.gadgetlink-app.com${props.tweet.user.image.url}`
              }
              width={150}
              height={150}
              alt='user-image'
            />
            <div className='user'>
              <Link href={`/users/${props.tweet.user.id}`}>{props.tweet.user.name}</Link>
            </div>
          </div>
        </div>
        <div className='post-content tweet-section-right'>
          <div className='tweet-icons'>
            <span className='tweet-icon'>
              {formatDistanceToNow(new Date(props.tweet.created_at), {
                addSuffix: true,
                locale: ja,
              })}
            </span>
            <TweetLike tweet={props.tweet} user={props.user} />
            <TweetBookmark tweet={props.tweet} user={props.user} />
            <span className='tweet-icon'>
              <FontAwesomeIcon className='icon-post' icon={faReply} onClick={toggleAccordion} />
            </span>
            {props.user && props.tweet.user_id === props.user.id ? (
              <TweetDelete
                tweet={props.tweet}
                mutate={props.mutate}
                swrKey={props.swrKey}
                setMessage={props.setMessage}
                setStatus={props.setStatus}
              />
            ) : null}
          </div>
          <div className='horizontal-rule'></div>
          <div className='p-2'>
            <span className='content text-break'>{props.tweet.content}</span>
          </div>
        </div>
      </div>
      <section
        ref={replyRef}
        style={replyStyle}
        className={`reply-section ${isOpen ? 'open' : 'closed'}`}
      >
        <TweetForm
          tweet={props.tweet}
          setMessage={props.setMessage}
          setStatus={props.setStatus}
          setReplyFormId={props.setReplyFormId}
          placeholder={'返信内容を入力'}
          mutate={props.mutate}
          swrKey={props.swrKey}
        />
      </section>
      <div>
        {props.replyCount !== undefined && props.replyCount !== 0 ? (
          <span className='reply-count' onClick={handleToggle}>
            {props.replyCount}件のリプライ
          </span>
        ) : null}
      </div>
      <div className={`reply-content ${showReply ? 'visible' : 'hidden'}`}>
        {relatedReplies?.map((reply) => {
          return (
            <ReplyTweet
              key={reply.id}
              tweet={reply}
              user={props.user}
              mutate={props.mutate}
              swrKey={props.swrKey}
              setMessage={props.setMessage}
              setStatus={props.setStatus}
            />
          )
        })}
      </div>
    </div>
  )
}
