import Layout, { siteTitle } from '@/components/layout'
import Message from '@/components/message'
import axios from 'axios'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'

const pageTitle = 'コミュニティ編集'

export default function New(props) {
  const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT_COMMUNITIES

  const [formData, setFormData] = useState({
    name: `${props.community.name}`,
    image: `${props.community.image.url}`,
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
      const response = await axios.patch(
        `${API_ENDPOINT}/${props.community.id}`,
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
      console.log(error)
      console.log('catch error')
    }
  }

  const isInitialRendered = useRef(true)

  useEffect(() => {
    // 初回レンダリング時には実行しない
    if (isInitialRendered.current) {
      isInitialRendered.current = false
      return
    }

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
  }, [status])

  return (
    <>
      <Layout user={props.user} pageName={'community'}>
        <Head>
          <title>{`${siteTitle} | ${pageTitle}`}</title>
        </Head>
        <Message message={message} status={status} />
        <div className='row justify-content-center'>
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
                  <input
                    type='submit'
                    name='commit'
                    value='変更を保存する'
                    className='btn btn-create'
                  />
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
  // ログインユーザー情報を取得
  const cookie = context.req?.headers.cookie
  const responseUser = await axios.get('http://back:3000/api/v1/check', {
    headers: {
      cookie: cookie,
    },
  })
  const user = await responseUser.data.user

  // コミュニティ詳細情報を取得
  const id = context.params.id
  const responseCommunity = await axios.get(`http://back:3000/api/v1/communities/${id}`, {
    headers: {
      cookie: cookie,
    },
  })
  const community = await responseCommunity.data.community

  return { props: { user: user, community: community } }
}
