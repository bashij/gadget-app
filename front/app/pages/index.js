import { useEffect, useState } from 'react'

import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { toast, ToastContainer } from 'react-toastify'

import Layout, { siteTitle } from '@/components/layout'
import apiClient from '@/utils/apiClient'

import 'react-toastify/dist/ReactToastify.css'

export default function Home(props) {
  const router = useRouter()
  const [message, setMessage] = useState([router.query.message])
  const [status, setStatus] = useState(router.query.status)

  useEffect(() => {
    // Statusを初期化
    setStatus()

    if (status === 'success') {
      // 成功メッセージを表示
      toast.success(`${message}`.replace(/,/g, '\n'), {
        position: 'top-center',
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        className: 'toast-message',
      })
    }
  }, [status])

  // サーバーサイドでエラーが発生した場合はエラーメッセージを表示して処理を終了する
  if (props.errorMessage) return props.errorMessage

  return (
    <Layout home user={props.user} pageName={'home'}>
      <Head>
        <title>{`${siteTitle} | HOME`}</title>
      </Head>
      <ToastContainer />
      {props.user ? (
        <div></div>
      ) : (
        // 非ログイン時のみ表示
        <div className='col-12'>
          <div className='bg-image'>
            <div className='top-content'>
              <h1 className='app-name'>GadgetLink</h1>
              <div className='content-explanation'>
                <p className='lead'>ガジェットで繋がるSNS</p>
                <div className='explanation-detail'>
                  <h2>こだわりのガジェットをシェア</h2>
                  <p>
                    <FontAwesomeIcon icon={faCheck} />
                    独自の活用法やカスタマイズ情報を交換
                  </p>
                  <p>
                    <FontAwesomeIcon icon={faCheck} />
                    同じガジェットのファンと交流
                  </p>
                </div>
                <div className='explanation-detail'>
                  <h2>気になるガジェット情報を収集</h2>
                  <p>
                    <FontAwesomeIcon icon={faCheck} />
                    自分と似たユーザーのガジェットを参考に
                  </p>
                  <p>
                    <FontAwesomeIcon icon={faCheck} />
                    リアルなユーザーの声をチェック
                  </p>
                </div>
              </div>
              <div className='btn-area'>
                <Link href='login' className='btn btn-lg btn-create'>
                  ログイン
                </Link>
                <Link href='signup' className='btn btn-lg btn-create'>
                  新規登録
                </Link>
              </div>
              <div className='guest-link'>
                <Link href='' className=''>
                  ゲストログイン
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
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
