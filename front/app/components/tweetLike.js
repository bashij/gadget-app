import apiClient from '@/utils/apiClient'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function TweetLike(props) {
  const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT_TWEETS

  const router = useRouter()
  const isInitialRendered = useRef(true)
  const [message, setMessage] = useState([])
  const [status, setStatus] = useState()
  const [likeCount, setLikeCount] = useState(props.tweet.tweet_likes.length)
  const [isLiked, setIsLiked] = useState(
    props.tweet.tweet_likes.some((like) => like.user_id === props.user?.id),
  )

  const handleClick = async (e, tweetId) => {
    try {
      let response
      if (isLiked) {
        response = await apiClient.delete(`${API_ENDPOINT}/${tweetId}/tweet_likes`, {
          data: { tweet_id: tweetId },
          withCredentials: true,
        })
      } else {
        response = await apiClient.post(
          `${API_ENDPOINT}/${tweetId}/tweet_likes`,
          {
            tweet_id: tweetId,
          },
          { withCredentials: true },
        )
      }
      const resMessage = await response.data.message
      const resStatus = await response.data.status
      const resCount = await response.data.count
      const resLiked = await response.data.liked
      setMessage(resMessage)
      setStatus(resStatus)
      setLikeCount(resCount)
      setIsLiked(resLiked)
    } catch (error) {
      setStatus('failure')
      if (error.response) {
        setMessage(error.response.errorMessage)
      } else if (error.request) {
        setMessage(error.request.errorMessage)
      } else {
        setMessage(error.errorMessage)
      }
    }
  }

  useEffect(() => {
    // 初回レンダリング時には実行しない
    if (isInitialRendered.current) {
      isInitialRendered.current = false
      return
    }

    // errorをcatchした場合
    if (status === 'failure') {
      // Statusを初期化
      setStatus()
      // エラーメッセージを表示
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
        '/login',
      )
    }
  }, [status])

  return (
    <span className='tweet-icon' id={`like_section_${props.tweet.id}`}>
      <FontAwesomeIcon
        className={isLiked ? 'icon-delete' : 'icon-post'}
        icon={faHeart}
        onClick={(event) => handleClick(event, props.tweet.id)}
      />
      <span>{likeCount}</span>
    </span>
  )
}
