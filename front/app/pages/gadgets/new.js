import { useEffect, useState } from 'react'

import Head from 'next/head'
import { useRouter } from 'next/router'

import { toast, ToastContainer } from 'react-toastify'

import Layout, { siteTitle } from '@/components/layout'
import MarkdownEditor from '@/components/markdownEditor'
import apiClient from '@/utils/apiClient'


import 'react-toastify/dist/ReactToastify.css'

const pageTitle = 'ガジェット登録'

export default function New(props) {
  // サーバーサイドでエラーが発生した場合はエラーメッセージを表示して処理を終了する
  if (props.errorMessage) return props.errorMessage

  const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT_GADGETS

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    model_number: '',
    manufacturer: '',
    price: '',
    other_info: '',
    image: '',
    review: '',
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
        { gadget: formData },
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
          pathname: `/gadgets/${id}`,
          query: { message: message, status: status },
        },
        `/gadgets/${id}`,
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
    if (!props.user) {
      router.push(
        {
          pathname: '/login',
          query: { message: 'ログインしてください', status: 'notLoggedIn' },
        },
        '/login',
      )
    }
  }, [status])

  return (
    <>
      <Layout user={props.user} pageName={'gadget'}>
        <Head>
          <title>{`${siteTitle} | ${pageTitle}`}</title>
        </Head>
        <ToastContainer />
        <div className='row justify-content-center'>
          <div className='col-12'>
            <form onSubmit={handleSubmit} className='row justify-content-center mt-3'>
              <div className='col-lg-8 col-sm-10'>
                <div className='mb-3'>
                  <label className='form-label'>ガジェット名</label>
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
                  <label className='form-label'>カテゴリ</label>
                  <span className='required-item'>必須</span>
                  <select
                    type='text'
                    className='form-control'
                    name='category'
                    onChange={handleChange}
                    value={formData.category}
                    required
                  >
                    <option value=''>選択してください</option>
                    <option value='PC本体'>PC本体</option>
                    <option value='モニター'>モニター</option>
                    <option value='キーボード'>キーボード</option>
                    <option value='マウス'>マウス</option>
                    <option value='オーディオ'>オーディオ</option>
                    <option value='デスク'>デスク</option>
                    <option value='チェア'>チェア</option>
                    <option value='その他'>その他</option>
                  </select>
                </div>
                <div className='mb-3'>
                  <label className='form-label'>型番</label>
                  <input
                    type='text'
                    className='form-control'
                    name='model_number'
                    onChange={handleChange}
                    value={formData.model_number}
                  />
                </div>
                <div className='mb-3'>
                  <label className='form-label'>メーカー</label>
                  <input
                    type='text'
                    className='form-control'
                    name='manufacturer'
                    onChange={handleChange}
                    value={formData.manufacturer}
                  />
                </div>
                <div className='mb-3'>
                  <label className='form-label'>価格</label>
                  <input
                    type='number'
                    className='form-control'
                    name='price'
                    onChange={handleChange}
                    value={formData.price}
                  />
                </div>
                <div className='mb-3'>
                  <label className='form-label'>その他スペック</label>
                  <input
                    type='text'
                    className='form-control'
                    name='other_info'
                    onChange={handleChange}
                    value={formData.other_info}
                  />
                </div>
                <div className='mb-3'>
                  <label className='form-label'>ガジェット画像</label>
                  <input
                    type='file'
                    className='form-control'
                    name='image'
                    onChange={handleChange}
                    value={formData.image?.url}
                  />
                </div>
              </div>
              <div className='col-12'>
                <MarkdownEditor formData={formData} setFormData={setFormData} />
              </div>
              <div className='col-lg-8 col-sm-10'>
                <div className='text-center m-4'>
                  <p>
                    <input
                      type='submit'
                      name='commit'
                      value='登録する'
                      className='btn btn-create'
                    />
                  </p>
                </div>
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
