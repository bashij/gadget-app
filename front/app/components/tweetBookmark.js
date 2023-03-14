import { faBookmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'

export default function TweetBookmark(props) {
  const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT_TWEETS

  const router = useRouter()
  const ref = useRef(true)
  const [message, setMessage] = useState([])
  const [status, setStatus] = useState()
  const [bookmarkCount, setBookmarkCount] = useState(props.tweet.tweet_bookmarks.length)
  const [isBookmarked, setIsBookmarked] = useState(
    props.tweet.tweet_bookmarks.some((bookmark) => bookmark.user_id === props.user?.id),
  )

  const handleClick = async (e, tweetId) => {
    try {
      let response
      if (isBookmarked) {
        response = await axios.delete(`${API_ENDPOINT}/${tweetId}/tweet_bookmarks`, {
          data: { tweet_id: tweetId },
          withCredentials: true,
        })
      } else {
        response = await axios.post(
          `${API_ENDPOINT}/${tweetId}/tweet_bookmarks`,
          {
            tweet_id: tweetId,
          },
          { withCredentials: true },
        )
      }
      const resMessage = await response.data.message
      const resStatus = await response.data.status
      const resCount = await response.data.count
      const resBookmarked = await response.data.bookmarked
      setMessage(resMessage)
      setStatus(resStatus)
      setBookmarkCount(resCount)
      setIsBookmarked(resBookmarked)
    } catch (error) {
      console.log(error)
      console.log('catch error')
    }
  }

  useEffect(() => {
    // 初回レンダリング時には実行しない
    if (ref.current) {
      ref.current = false
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
  }, [status])

  return (
    <span className='tweet-icon' id={`bookmark_section_${props.tweet.id}`}>
      <FontAwesomeIcon
        className={isBookmarked ? 'icon-delete' : 'icon-post'}
        icon={faBookmark}
        onClick={(event) => handleClick(event, props.tweet.id)}
      />
      <span>{bookmarkCount}</span>
    </span>
  )
}
