import Layout, { siteTitle } from '@/components/layout'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
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

  return (
    <Layout home user={props.user} pageName={'home'}>
      <Head>
        <title>{`${siteTitle} | HOME`}</title>
      </Head>
      <ToastContainer />
      {props.user ? (
        <div>ログイン状態</div>
      ) : (
        // 非ログイン時のみ表示
        <div className='col-md-12'>
          <div className='bg-image'>
            <div className='top-content'>
              <h1 className='app-name'>GadgetLink</h1>
              <div className='content-explanation'>
                <p className='lead'>ガジェットで繋がるSNS</p>
                <div className='explanation-detail'>
                  <h2 className='fw-bold'>こだわりのガジェットをシェア</h2>
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
                  <h2 className='fw-bold'>気になるガジェット情報を収集</h2>
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
  const cookie = context.req?.headers.cookie
  const response = await axios.get('http://back:3000/api/v1/check', {
    headers: {
      cookie: cookie,
    },
  })

  const user = await response.data.user

  return { props: { user: user } }
}
