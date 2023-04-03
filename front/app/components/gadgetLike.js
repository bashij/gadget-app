import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'

export default function GadgetLike(props) {
  const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT_GADGETS

  const router = useRouter()
  const isInitialRendered = useRef(true)
  const [message, setMessage] = useState([])
  const [status, setStatus] = useState()
  const [likeCount, setLikeCount] = useState(props.gadget.gadget_likes.length)
  const [isLiked, setIsLiked] = useState(
    props.gadget.gadget_likes.some((like) => like.user_id === props.user?.id),
  )

  const handleClick = async (e, gadgetId) => {
    try {
      let response
      if (isLiked) {
        response = await axios.delete(`${API_ENDPOINT}/${gadgetId}/gadget_likes`, {
          data: { gadget_id: gadgetId },
          withCredentials: true,
        })
      } else {
        response = await axios.post(
          `${API_ENDPOINT}/${gadgetId}/gadget_likes`,
          {
            gadget_id: gadgetId,
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
  }, [status])

  return (
    <>
      <FontAwesomeIcon
        className={isLiked ? 'icon-delete' : 'icon-post'}
        icon={faHeart}
        onClick={(event) => handleClick(event, props.gadget.id)}
      />
      <span>{likeCount}</span>
    </>
  )
}
