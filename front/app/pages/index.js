import Layout, { siteTitle } from '@/components/layout'
import Message from '@/components/message'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import cookie from 'cookie'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'

export async function getServerSideProps(context) {
  // CookieにセッションIDが含まれているか確認する
  const cookies = cookie.parse(context.req.headers.cookie ?? '')
  const sessionId = cookies['_session_id']
  if (sessionId) {
    // セッションIDがある場合はログイン済み
    return {
      props: { user: { isLoggedIn: true } },
    }
  } else {
    // セッションIDがない場合は未ログイン
    return {
      props: { user: { isLoggedIn: false } },
    }
  }
}

export default function Home(props) {
  const router = useRouter()
  const [message, setMessage] = useState([router.query.message])
  const [status, setStatus] = useState(router.query.status)

  return (
    <Layout home>
      <Head>
        <title>{`${siteTitle} | HOME`}</title>
      </Head>
      <Message message={message} status={status} />
      {props.user.isLoggedIn ? (
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
