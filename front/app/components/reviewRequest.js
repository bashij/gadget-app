import axios from 'axios'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'

export default function ReviewRequest(props) {
  const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT_GADGETS

  const router = useRouter()
  const isInitialRendered = useRef(true)
  const [message, setMessage] = useState([])
  const [status, setStatus] = useState()
  const [isRequested, setIsRequested] = useState(
    props.gadget.review_requests.some((request) => request.user_id === props.user?.id),
  )

  const handleClick = async (e, gadgetId) => {
    try {
      let response
      if (isRequested) {
        response = await axios.delete(`${API_ENDPOINT}/${gadgetId}/review_requests`, {
          data: { gadget_id: gadgetId },
          withCredentials: true,
        })
      } else {
        response = await axios.post(
          `${API_ENDPOINT}/${gadgetId}/review_requests`,
          {
            gadget_id: gadgetId,
          },
          { withCredentials: true },
        )
      }
      const resMessage = await response.data.message
      const resStatus = await response.data.status
      const resCount = await response.data.count
      const resRequested = await response.data.requested
      setMessage(resMessage)
      setStatus(resStatus)
      props.setReviewRequestCount(resCount)
      setIsRequested(resRequested)
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
    <span className='' id={`review_request_section_${props.gadget.id}`}>
      {isRequested ? (
        <p onClick={(event) => handleClick(event, props.gadget.id)}>レビューリクエストをやめる</p>
      ) : (
        <p onClick={(event) => handleClick(event, props.gadget.id)}>レビューをリクエストする</p>
      )}
    </span>
  )
}
