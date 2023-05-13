import { useEffect, useState } from 'react'

import Head from 'next/head'
import { useRouter } from 'next/router'

import { toast, ToastContainer } from 'react-toastify'

import Layout, { siteTitle } from '@/components/layout'
import apiClient from '@/utils/apiClient'

import 'react-toastify/dist/ReactToastify.css'

const pageTitle = 'コミュニティ登録'

export default function New(props) {
  const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT_COMMUNITIES

  const [formData, setFormData] = useState({
    name: '',
    image: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const router = useRouter()
  const [message, setMessage] = useState([router.query.message])
  const [status, setStatus] = useState(router.query.status)
  const [id, setId] = useState()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await apiClient.post(
        API_ENDPOINT,
        { community: formData },
        { withCredentials: true },
      )
      const resMessage = await response.data.message
      const resStatus = await response.data.status
      const resId = await response.data.id
      setMessage(resMessage)
      setStatus(resStatus)
      setId(resId)
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
          pathname: `/communities/${id}`,
          query: { message: message, status: status },
        },
        `/communities/${id}`,
      )
      setMessage([])
      setStatus()
    }

    // 新規作成処理が失敗した場合
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

    // 非ログイン時はログイン画面へ遷移
    if (!props.errorMessage && !props.user) {
      router.push(
        {
          pathname: '/login',
          query: { message: 'ログインしてください', status: 'notLoggedIn' },
        },
        '/login',
      )
    }
  }, [status])

  // サーバーサイドでエラーが発生した場合はエラーメッセージを表示して処理を終了する
  if (props.errorMessage) return props.errorMessage

  return (
    <>
      <Layout user={props.user} pageName={'community'}>
        <Head>
          <title>{`${siteTitle} | ${pageTitle}`}</title>
        </Head>
        <ToastContainer />
        <div className='row justify-content-center mt-3'>
          <div className='col-lg-8 col-sm-10'>
            <form onSubmit={handleSubmit}>
              <div className='mb-3'>
                <label className='form-label'>コミュニティ名</label>
                <span className='required-item'>必須</span>
                <input
                  type='text'
                  className='form-control'
                  name='name'
                  onChange={handleChange}
                  value={formData.name}
                  required
                />
              </div>
              <div className='mb-3'>
                <label className='form-label'>コミュニティ画像</label>
                <input
                  type='file'
                  className='form-control'
                  name='image'
                  onChange={handleChange}
                  value={formData.image.url}
                />
              </div>
              <div className='text-center m-4'>
                <p>
                  <input type='submit' name='commit' value='登録する' className='btn btn-create' />
                </p>
              </div>
            </form>
          </div>
        </div>
      </Layout>
    </>
  )
}

export const getServerSideProps = async (context) => {
  try {
    const cookie = context.req?.headers.cookie
    const response = await apiClient.get(process.env.API_ENDPOINT_CHECK_SESSION, {
      headers: {
        cookie: cookie,
      },
    })

    const user = await response.data.user

    return { props: { user: user } }
  } catch (error) {
    // エラーに応じたメッセージを取得する
    let errorMessage = ''

    if (error.response) {
      errorMessage = error.response.errorMessage
    } else if (error.request) {
      errorMessage = error.request.errorMessage
    } else {
      errorMessage = error.errorMessage
    }

    return { props: { errorMessage: errorMessage } }
  }
}
