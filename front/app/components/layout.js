import Head from 'next/head'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import React, { useState } from 'react'

export const siteTitle = 'GadgetLink'

export default function Layout({ children, home }) {
  return (
    <>
      <Head>
        <meta name='viewport' content='width=device-width,initial-scale=1' />
        <meta name='og:title' content={siteTitle} />
      </Head>
      <header className='header p-2 p-lg-3 mb-5 row'>
        {/* ロゴ */}
        <div className='logo fs-2 col-3'>
          <Link href='/'>GadgetLink</Link>
        </div>
        {/* メニュー 通常時 */}
        <div className='menu d-none d-lg-block col-lg-9 text-end'>
          <Link href='/' className='d-inline-block nav-link' id='home_large'>
            HOME
          </Link>
          <Link href='help' className='d-inline-block nav-link' id='help_large'>
            HELP
          </Link>
          <Link href='users' className='d-inline-block nav-link' id='users_large'>
            USERS
          </Link>
          {/* ログイン時のみ表示 */}
          <Link href='' className='d-inline-block nav-link' id='mypage_large'>
            MYPAGE
          </Link>
          <Link href='' className='d-inline-block nav-link' id='setting_large'>
            SETTING
          </Link>
          <Link href='' className='d-inline-block nav-link' id='logout_large'>
            LOGOUT
          </Link>
          {/* 非ログイン時のみ表示 */}
          <Link href='' className='d-inline-block nav-link' id='login_large'>
            LOGIN
          </Link>
        </div>
        {/* メニュー 縮小時 */}
        <SmallMenu />
      </header>
      <div className='container'>{children}</div>
      {!home && (
        <div className=''>
          <Link href='/'>← ホームに戻る</Link>
        </div>
      )}
    </>
  )
}

export function SmallMenu() {
  const [openMenu, setOpenMenu] = useState(false)
  const menuFunction = () => {
    setOpenMenu(!openMenu)
  }

  return (
    <>
      <div className='fs-2 col-9 d-lg-none d-inline-block pe-3 text-end'>
        <FontAwesomeIcon icon={faBars} className='menu-btn' onClick={() => menuFunction()} />
      </div>
      <div
        id='nav_header'
        className={`col-12 d-lg-none text-end drawerMenu ${openMenu ? 'open' : 'hidden'}`}
      >
        <Link href='/' className='d-block nav-link' id='home_small'>
          HOME
        </Link>
        <Link href='help' className='d-block nav-link' id='help_small'>
          HELP
        </Link>
        <Link href='users' className='d-block nav-link' id='users_small'>
          USERS
        </Link>
        {/* ログイン時のみ表示 */}
        <Link href='' className='d-block nav-link' id='mypage_small'>
          MYPAGE
        </Link>
        <Link href='' className='d-block nav-link' id='setting_small'>
          SETTING
        </Link>
        <Link href='' className='d-block nav-link' id='logout_small'>
          LOGOUT
        </Link>
        {/* 非ログイン時のみ表示 */}
        <Link href='' className='d-block nav-link' id='login_small'>
          LOGIN
        </Link>
      </div>
    </>
  )
}
