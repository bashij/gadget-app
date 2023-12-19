import { useEffect, useState } from 'react'

import { useRouter } from 'next/router'

import { toast } from 'react-toastify'

import apiClient from '@/utils/apiClient'

export default function GuestLogin() {
  const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT_GUEST

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    job: '',
    image: '',
    password: '',
    password_confirmation: '',
  })

  const router = useRouter()
  const [message, setMessage] = useState([router.query.message])
  const [status, setStatus] = useState(router.query.status)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await apiClient.post(
        API_ENDPOINT,
        { user: formData },
        { withCredentials: true },
      )
      const resMessage = await response.data.message
      const resStatus = await response.data.status
      setMessage(resMessage)
      setStatus(resStatus)
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
    if (status === 'success') {
      router.push(
        {
          pathname: '/',
          query: { message: message, status: status },
        },
        '/',
      )
      setMessage([])
    }

    // ログイン処理が失敗した場合
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
  }, [status])

  return (
    <form onSubmit={handleSubmit}>
      <input type='submit' name='commit' value='ゲストログイン' className='btn btn-create' />
    </form>
  )
}
