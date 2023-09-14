import { useEffect, useRef, useState } from 'react'

import { useRouter } from 'next/router'

import { toast } from 'react-toastify'

import apiClient from '@/utils/apiClient'
import 'react-toastify/dist/ReactToastify.css'

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
        response = await apiClient.delete(`${API_ENDPOINT}/${gadgetId}/review_requests`, {
          data: { gadget_id: gadgetId },
          withCredentials: true,
        })
      } else {
        response = await apiClient.post(
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
    <span className='' id={`review_request_section_${props.gadget.id}`}>
      <p
        onClick={(event) => handleClick(event, props.gadget.id)}
        data-testid={`review_request_icon_${props.gadget.id}`}
      >
        {isRequested ? 'レビューリクエストをやめる' : 'レビューをリクエストする'}
      </p>
    </span>
  )
}
