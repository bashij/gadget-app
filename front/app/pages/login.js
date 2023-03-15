import Layout, { siteTitle } from '@/components/layout'
import Message from '@/components/message'
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'

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
      const response = await axios.post(
        API_ENDPOINT,
        { session: formData },
        { withCredentials: true },
      )
      const resmessage = await response.data.message
      const resstatus = await response.data.status
      setMessage(resmessage)
      setStatus(resstatus)
    } catch (error) {
      console.log(error)
      console.log('catch error')
    }
  }

  const ref = useRef(true)

  useEffect(() => {
    // 初回レンダリング時には実行しない
    if (ref.current) {
      ref.current = false
      return
    }

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
  }, [status])

  return (
    <>
      <Layout login>
        <Head>
          <title>{`${siteTitle} | ${pageTitle}`}</title>
        </Head>
        <div className='content-header'>
          <h3>{pageTitle}</h3>
        </div>
        <Message message={message} status={status} />
        <div className='row justify-content-center'>
          <div className='col-md-6 col-md-offset-3'>
            <form onSubmit={handleSubmit}>
              <div className='mb-3'>
                <label className='form-label'>メールアドレス</label>
                <span className='required-item'>必須</span>
                <input
                  type='email'
                  className='form-control'
                  name='email'
                  onChange={handleChange}
                  value={formData.email}
                  required
                />
              </div>
              <div className='mb-3'>
                <label className='form-label'>パスワード</label>
                <span className='required-item'>必須</span>
                <input
                  type='password'
                  className='form-control'
                  name='password'
                  onChange={handleChange}
                  value={formData.password}
                  required
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
            <div className='p-3 mb-4 text-center h5'>
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
