import Link from 'next/link'
import Image from 'next/image'
import TweetLike from '../components/tweetLike'
import TweetBookmark from '../components/tweetBookmark'
import TweetDelete from '../components/tweetDelete'
import TweetForm from '../components/tweetForm'
import ReplyFeed from '../components/replyFeed'
import Message from '../components/message'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faBookmark, faReply, faTrash } from '@fortawesome/free-solid-svg-icons'
import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { ja } from 'date-fns/locale'

export default function Reply(props) {
  const [isDeleted, setIsDeleted] = useState(false)
  const [latestClass, setLatestClass] = useState()

  const router = useRouter()
  const [message, setMessage] = useState([router.query.message])
  const [status, setStatus] = useState(router.query.status)
  const [newTweet, setNewTweet] = useState()

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
    <div className={`reply ${props.latest ? `latest ${latestClass}` : ''}`}>
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
              <Link href={`users/${props.tweet.user}`}>{props.tweet.user.name}</Link>
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
            {props.user && props.tweet.user_id === props.user.id ? (
              <TweetDelete
                tweet={props.tweet}
                user={props.user}
                setIsDeleted={setIsDeleted}
                setUpdatedReplyCount={props.setUpdatedReplyCount}
              />
            ) : null}
          </div>
          <div className='horizontal-rule'></div>
          <div className='p-2'>
            <span className='content text-break'>{props.tweet.content}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
