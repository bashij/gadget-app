import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'

export default function TweetDelete(props) {
  const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT_TWEETS

  const router = useRouter()
  const isInitialRendered = useRef(true)
  const [message, setMessage] = useState([])
  const [status, setStatus] = useState()

  const handleClick = async (e, tweetId) => {
    try {
      const confirmed = window.confirm('削除してよろしいですか？')
      if (!confirmed) {
        return
      }
      const response = await axios.delete(`${API_ENDPOINT}/${tweetId}`, {
        data: { tweet_id: tweetId },
        withCredentials: true,
      })
      const resMessage = await response.data.message
      const resStatus = await response.data.status
      const resUpdatedReplyCount = await response.data.replyCount
      setMessage(resMessage)
      setStatus(resStatus)
      props.setUpdatedReplyCount(resUpdatedReplyCount)
    } catch (error) {
      console.log(error)
      console.log('catch error')
    }
  }

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
      props.setIsDeleted(true)
    }
  }, [status])

  return (
    <span className='tweet-icon'>
      <FontAwesomeIcon
        className='icon-delete'
        icon={faTrash}
        onClick={(event) => handleClick(event, props.tweet.id)}
      />
    </span>
  )
}
