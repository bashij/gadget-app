import { useEffect, useState } from 'react'

import Head from 'next/head'
import { useRouter } from 'next/router'

import { toast, ToastContainer } from 'react-toastify'

import Layout, { siteTitle } from '@/components/layout'
import UserDelete from '@/components/userDelete'
import apiClient from '@/utils/apiClient'

import 'react-toastify/dist/ReactToastify.css'

const pageTitle = 'ユーザー情報編集'

export default function Edit(props) {
  const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT_USERS

  const [formData, setFormData] = useState({
    name: `${props.pageUser?.name}`,
    email: `${props.pageUser?.email}`,
    job: `${props.pageUser?.job}`,
    image: `${props.pageUser?.image.url}`,
    password: '',
    password_confirmation: '',
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
      const response = await apiClient.patch(
        `${API_ENDPOINT}/${props.pageUser.id}`,
        { user: formData },
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

  const [isPageDeleted, setIsPageDeleted] = useState(false)

  useEffect(() => {
    // Statusを初期化
    setStatus()

    if (status === 'success') {
      // ユーザー削除時はHOMEへ遷移
      if (isPageDeleted) {
        router.push(
          {
            pathname: `/`,
            query: { message: message, status: status },
          },
          `/`,
        )
      } else {
        // 成功時はユーザー詳細ページに遷移
        router.push(
          {
            pathname: `/users/${id}`,
            query: { message: message, status: status },
          },
          `/users/${id}`,
        )
      }
    }

    // 失敗メッセージを表示
    if (status === 'failure') {
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
    if (!props.errorMessage && !props.currentUser) {
      router.push(
        {
          pathname: '/login',
          query: { message: 'ログインしてください', status: 'notLoggedIn' },
        },
        '/login',
      )
    }

    // 非ログイン時に何らかのAPI処理を実行した場合もログイン画面へ遷移
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

  // サーバーサイドでエラーが発生した場合はエラーメッセージを表示して処理を終了する
  if (props.errorMessage) return props.errorMessage

  return (
    <>
      <Layout user={props.currentUser} pageName={'setting'}>
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
                  value={formData.image.url}
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
                  <input
                    type='submit'
                    name='commit'
                    value='変更を保存する'
                    className='btn btn-create'
                  />
                </p>
              </div>
            </form>
            <UserDelete
              user={props.pageUser}
              setMessage={setMessage}
              setStatus={setStatus}
              setIsPageDeleted={setIsPageDeleted}
            />
          </div>
        </div>
      </Layout>
    </>
  )
}

export const getServerSideProps = async (context) => {
  try {
    // ログインユーザー情報を取得
    const cookie = context.req?.headers.cookie
    const responseCurrentUser = await apiClient.get(process.env.API_ENDPOINT_CHECK_SESSION, {
      headers: {
        cookie: cookie,
      },
    })
    const currentUser = await responseCurrentUser.data.user

    // ユーザー詳細情報を取得
    const id = context.params.id
    const responseUser = await apiClient.get(`${process.env.API_ENDPOINT_USERS}/${id}`, {
      headers: {
        cookie: cookie,
      },
    })

    const pageUser = await responseUser.data.user
    const userCount = await responseUser.data.userCount

    return { props: { currentUser: currentUser, pageUser: pageUser, userCount: userCount } }
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
