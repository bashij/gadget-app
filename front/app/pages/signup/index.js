import Head from 'next/head'
import Layout, { siteTitle } from '../../components/layout'
import Message from '../../components/message'
import axios from 'axios'
import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'

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
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const [message, setMessage] = useState([])
  const [status, setStatus] = useState()

  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(API_ENDPOINT, { user: formData })

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
    <Layout signup>
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
              <label className='form-label'>ユーザー名</label>
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
              <label className='form-label'>職業</label>
              <span className='required-item'>必須</span>
              <select
                name='job'
                id='id'
                className='form-control'
                onChange={handleChange}
                value={formData.job}
                required
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
              <label className='form-label'>ユーザー画像</label>
              <input
                type='file'
                className='form-control'
                name='image'
                onChange={handleChange}
                value={formData.image}
              />
            </div>
            <div className='mb-3'>
              <label className='form-label'>パスワード</label>
              {pageTitle === 'ユーザー登録' ? <span className='required-item'>必須</span> : null}
              <input
                type='password'
                className='form-control'
                name='password'
                onChange={handleChange}
                value={formData.password}
                required={pageTitle === 'ユーザー登録' ? true : false}
              />
            </div>
            <div className='mb-3'>
              <label className='form-label'>パスワード（確認）</label>
              {pageTitle === 'ユーザー登録' ? <span className='required-item'>必須</span> : null}
              <input
                type='password'
                className='form-control'
                name='password_confirmation'
                onChange={handleChange}
                value={formData.password_confirmation}
                required={pageTitle === 'ユーザー登録' ? true : false}
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
