import { useEffect, useState } from 'react'

import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { faCirclePlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { toast, ToastContainer } from 'react-toastify'

import Layout, { siteTitle } from '@/components/layout'
import apiClient from '@/utils/apiClient'

import 'react-toastify/dist/ReactToastify.css'

const pageTitle = 'ログイン'

export default function Login() {
  const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT_LOGIN

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember_me: false,
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const router = useRouter()
  const [message, setMessage] = useState([router.query.message])
  const [status, setStatus] = useState(router.query.status)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await apiClient.post(
        API_ENDPOINT,
        { session: formData },
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
          pathname: '/gadgets',
          query: { message: message, status: status },
        },
        '/gadgets',
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

    // 非ログイン状態なことで別ページから遷移してきた場合
    if (status === 'notLoggedIn') {
      // Statusを初期化
      setStatus()
      // エラーメッセージを表示
      toast.error(`${message}`.replace(/,/g, '\n'), {
        position: 'top-center',
        autoClose: 1000,
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
    <>
      <Layout login pageName={'logIn'}>
        <Head>
          <title>{`${siteTitle} | ${pageTitle}`}</title>
        </Head>
        <ToastContainer />
        <div className='row justify-content-center mt-3'>
          <div className='col-lg-8 col-sm-10'>
            <form onSubmit={handleSubmit}>
              <div className='mb-3'>
                <label className='form-label' htmlFor='email'>
                  メールアドレス
                </label>
                <span className='required-item'>必須</span>
                <input
                  type='email'
                  className='form-control'
                  name='email'
                  onChange={handleChange}
                  value={formData.email}
                  required
                  id='email'
                />
              </div>
              <div className='mb-3'>
                <label className='form-label' htmlFor='password'>
                  パスワード
                </label>
                <span className='required-item'>必須</span>
                <input
                  type='password'
                  className='form-control'
                  name='password'
                  onChange={handleChange}
                  value={formData.password}
                  required
                  id='password'
                />
              </div>
              <div className='mb-3'>
                <input
                  type='checkbox'
                  name='remember_me'
                  checked={formData.remember_me}
                  onChange={(e) => setFormData({ ...formData, remember_me: e.target.checked })}
                />
                <span className='ps-1'>次回から入力を省略</span>
              </div>
              <div className='text-center m-4'>
                <p>
                  <input type='submit' name='commit' value='ログイン' className='btn btn-create' />
                </p>
              </div>
            </form>
            <div className='new-page-link'>
              <Link href='signup'>
                <p>
                  <FontAwesomeIcon className='pe-2' icon={faCirclePlus} />
                  新しくユーザー登録する
                </p>
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}
