import { faBookmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'

export default function GadgetBookmark(props) {
  const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT_GADGETS

  const router = useRouter()
  const isInitialRendered = useRef(true)
  const [message, setMessage] = useState([])
  const [status, setStatus] = useState()
  const [bookmarkCount, setBookmarkCount] = useState(props.gadget.gadget_bookmarks.length)
  const [isBookmarked, setIsBookmarked] = useState(
    props.gadget.gadget_bookmarks.some((bookmark) => bookmark.user_id === props.user?.id),
  )

  const handleClick = async (e, gadgetId) => {
    try {
      let response
      if (isBookmarked) {
        response = await axios.delete(`${API_ENDPOINT}/${gadgetId}/gadget_bookmarks`, {
          data: { gadget_id: gadgetId },
          withCredentials: true,
        })
      } else {
        response = await axios.post(
          `${API_ENDPOINT}/${gadgetId}/gadget_bookmarks`,
          {
            gadget_id: gadgetId,
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
        className={isBookmarked ? 'icon-delete' : 'icon-post'}
        icon={faBookmark}
        onClick={(event) => handleClick(event, props.gadget.id)}
      />
      <span>{bookmarkCount}</span>
    </>
  )
}
