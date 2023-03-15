import Message from '@/components/message'
import ReplyFeed from '@/components/replyFeed'
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
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'

export default function Tweet(props) {
  const [isDeleted, setIsDeleted] = useState(false)
  const [latestClass, setLatestClass] = useState()

  const router = useRouter()
  const [message, setMessage] = useState([router.query.message])
  const [status, setStatus] = useState(router.query.status)
  const [newTweet, setNewTweet] = useState()
  const [updatedReplyCount, setUpdatedReplyCount] = useState()

  const replyCount = props.replyCounts[props.tweet.id]

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

  useEffect(() => {
    setLatestClass('reset-box-shadow')
  }, [])

  useEffect(() => {
    if (status === 'success') {
      document.getElementById(`reply_form_${props.tweet.id}`)?.reset()
    }
  }, [status, newTweet])

  return isDeleted ? (
    <div className='parent-post deleted-post' id={`tweet_${props.tweet.id}`}></div>
  ) : (
    <div className={`parent-post ${props.latest ? `latest ${latestClass}` : ''}`}>
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
              <Link href={`users/${props.tweet.user}`}>{props.tweet.user.name}</Link>：
              {props.tweet.id}
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
              <TweetDelete tweet={props.tweet} user={props.user} setIsDeleted={setIsDeleted} />
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
        <Message message={message} status={status} />
        <TweetForm
          setMessage={setMessage}
          setStatus={setStatus}
          setNewTweet={setNewTweet}
          setUpdatedReplyCount={setUpdatedReplyCount}
          placeholder={'返信内容を入力'}
          parentId={props.tweet.id}
        />
      </section>
      <ReplyFeed
        tweet={props.tweet}
        user={props.user}
        replies={props.replies}
        replyCount={replyCount}
        newTweet={newTweet}
        data={props.data}
        status={status}
        message={message}
        isDeleted={isDeleted}
        updatedReplyCount={updatedReplyCount}
      />
    </div>
  )
}
