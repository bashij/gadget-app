import { useEffect, useRef, useState } from 'react'

import Head from 'next/head'
import { useRouter } from 'next/router'

import { toast, ToastContainer } from 'react-toastify'

import Layout, { siteTitle } from '@/components/layout'
import apiClient from '@/utils/apiClient'

import 'react-toastify/dist/ReactToastify.css'

const pageTitle = 'ユーザー登録'

export default function Signup() {
  const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT_USERS

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    job: '',
    image: '',
    password: '',
    password_confirmation: '',
  })

  const handleChange = (e) => {
    const { name, value, files } = e.target
    e.target.name === 'image'
      ? setFormData({ ...formData, [name]: files[0] })
      : setFormData({ ...formData, [name]: value })
  }

  const [message, setMessage] = useState([])
  const [status, setStatus] = useState()

  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await apiClient.post(
        API_ENDPOINT,
        { user: formData },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
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

  const isInitialRendered = useRef(true)

  useEffect(() => {
    // 初回レンダリング時には実行しない
    if (isInitialRendered.current) {
      isInitialRendered.current = false
      return
    }

    // ユーザー新規登録完了後はHOMEへ遷移
    if (status === 'success') {
      router.push(
        {
          pathname: '/gadgets',
          query: { message: message, status: status },
        },
        '/gadgets',
      )
      setMessage([])
      setStatus()
    }

    // 処理が失敗した場合
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
    <Layout signup>
      <Head>
        <title>{`${siteTitle} | ${pageTitle}`}</title>
      </Head>
      <ToastContainer />
      <div className='row justify-content-center mt-3'>
        <div className='col-lg-8 col-sm-10'>
          <form onSubmit={handleSubmit}>
            <div className='mb-3'>
              <label className='form-label' htmlFor='name'>
                ユーザー名
              </label>
              <span className='required-item'>必須</span>
              <input
                type='text'
                className='form-control'
                name='name'
                onChange={handleChange}
                value={formData.name}
                required
                id='name'
              />
            </div>
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
              <label className='form-label' htmlFor='job'>
                職業
              </label>
              <span className='required-item'>必須</span>
              <select
                name='job'
                className='form-control'
                onChange={handleChange}
                value={formData.job}
                required
                id='job'
              >
                <option value=''>選択してください</option>
                <option value='IT系'>IT系</option>
                <option value='非IT系'>非IT系</option>
                <option value='学生'>学生</option>
                <option value='YouTuber/ブロガー'>YouTuber/ブロガー</option>
                <option value='その他'>その他</option>
              </select>
            </div>
            <div className='mb-3'>
              <label className='form-label' htmlFor='image'>
                ユーザー画像
              </label>
              <input
                type='file'
                className='form-control'
                name='image'
                onChange={handleChange}
                value={formData.image?.url}
                id='image'
              />
            </div>
            <div className='mb-3'>
              <label className='form-label' htmlFor='password'>
                パスワード
              </label>
              {pageTitle === 'ユーザー登録' ? <span className='required-item'>必須</span> : null}
              <input
                type='password'
                className='form-control'
                name='password'
                onChange={handleChange}
                value={formData.password}
                required={pageTitle === 'ユーザー登録' ? true : false}
                id='password'
              />
            </div>
            <div className='mb-3'>
              <label className='form-label' htmlFor='password_confirmation'>
                パスワード（確認）
              </label>
              {pageTitle === 'ユーザー登録' ? <span className='required-item'>必須</span> : null}
              <input
                type='password'
                className='form-control'
                name='password_confirmation'
                onChange={handleChange}
                value={formData.password_confirmation}
                required={pageTitle === 'ユーザー登録' ? true : false}
                id='password_confirmation'
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
  )
}
