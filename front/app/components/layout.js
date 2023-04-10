import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

export const siteTitle = 'GadgetLink'

export default function Layout(props) {
  const [openMenu, setOpenMenu] = useState(false)
  const menuFunction = () => {
    setOpenMenu(!openMenu)
  }

  return (
    <>
      <Head>
        <meta name='viewport' content='width=device-width,initial-scale=1' />
        <meta name='og:title' content={siteTitle} />
      </Head>
      <div className='container'>
        <div className='row'>
          <div className={`col-sm-3 side-menu ${openMenu ? 'open' : ''}`}>
            <Link href='/' className='logo nav-link'>
              GadgetLink
            </Link>
            <Link
              href='/'
              className={`nav-link ${props.pageName === 'home' ? 'active' : ''}`}
              id='home'
            >
              HOME
            </Link>
            <Link
              href='/tweets'
              className={`nav-link ${props.pageName === 'tweet' ? 'active' : ''}`}
              id='tweet'
            >
              TWEET
            </Link>
            <Link
              href='/gadgets'
              className={`nav-link ${props.pageName === 'gadget' ? 'active' : ''}`}
              id='gadget'
            >
              GADGET
            </Link>
            <Link
              href='/communities'
              className={`nav-link ${props.pageName === 'community' ? 'active' : ''}`}
              id='community'
            >
              COMMUNITY
            </Link>
            <Link
              href='/help'
              className={`nav-link ${props.pageName === 'help' ? 'active' : ''}`}
              id='help'
            >
              HELP
            </Link>
            <Link
              href='/users'
              className={`nav-link ${props.pageName === 'users' ? 'active' : ''}`}
              id='users'
            >
              USERS
            </Link>
            {/* ログイン時のみユーザー情報を表示 */}
            {props.user ? (
              <div className='user-menu'>
                <div className='user-info'>
                  <span className='nav-link'>
                    <Image
                      src={
                        props.user.image.url == 'default.jpg'
                          ? '/images/default.jpg'
                          : `https://static.gadgetlink-app.com${props.tweet.user.image.url}`
                      }
                      width={100}
                      height={100}
                      alt='user-image'
                    />
                  </span>
                  <span className='nav-link'>{props.user.name}</span>
                </div>
                <Link
                  href={`/users/${props.user.id}`}
                  className={`nav-link ${props.pageName === 'myPage' ? 'active' : ''}`}
                  id='mypage'
                >
                  MYPAGE
                </Link>
                <Link
                  href={`/users/${props.user.id}/edit`}
                  className={`nav-link ${props.pageName === 'setting' ? 'active' : ''}`}
                  id='setting'
                >
                  SETTING
                </Link>
                <Link href='' className='nav-link' id='logout'>
                  LOGOUT
                </Link>
              </div>
            ) : (
              <Link
                href='/login'
                className={`nav-link ${props.pageName === 'logIn' ? 'active' : ''}`}
                id='login'
              >
                LOGIN
              </Link>
            )}
          </div>
          <div className='side-menu-button'>
            {openMenu ? (
              <span className='icon-times'>
                <FontAwesomeIcon icon={faTimes} onClick={() => menuFunction()} />
              </span>
            ) : (
              <span className='icon-bars'>
                <FontAwesomeIcon icon={faBars} onClick={() => menuFunction()} />
              </span>
            )}
          </div>
          <div className='col-sm-3 side-menu-dummy'></div>
          <div className='col-sm-9 col-xs-12 main'>{props.children}</div>
          {!props.home && (
            <div className='col-12 text-end'>
              <Link href='/'>ホームに戻る</Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
