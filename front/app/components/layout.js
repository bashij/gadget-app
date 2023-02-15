import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

export const siteTitle = 'GadgetLink';

export default function Layout({ children, home }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="og:title" content={siteTitle} />
      </Head>
      <header className="header p-2 p-lg-3 mb-5 row">
          {/* ロゴ */}
          <div className="logo fs-2 col-3">
            <Link href="/">GadgetLink</Link>
          </div>
          {/* メニュー 通常時 */}
          <div className="menu d-none d-lg-block col-lg-9 text-end">
            <Link href="" className='d-inline-block nav-link' id="home_large">HOME</Link>
            <Link href="" className='d-inline-block nav-link' id="help_large">HELP</Link>
            <Link href="users" className='d-inline-block nav-link' id="users_large">USERS</Link>
            {/* ログイン時のみ表示 */}
            <Link href="" className='d-inline-block nav-link' id="mypage_large">MYPAGE</Link>
            <Link href="" className='d-inline-block nav-link' id="setting_large">SETTING</Link>
            <Link href="" className='d-inline-block nav-link' id="logout_large">LOGOUT</Link>
            {/* 非ログイン時のみ表示 */}
            <Link href="" className='d-inline-block nav-link' id="login_large">LOGIN</Link>
          </div>
          {/* メニュー 縮小時 */}
          <div className="menu-btn fs-2 col-9 d-lg-none d-inline-block pe-3 text-end">
            <a id="header_menu" className="" data-bs-toggle="collapse" href="#nav_header" aria-expanded="false" aria-controls="nav_header" data-bs-placement="top" title="返信フォームを開く">
              <i className="fa-solid fa-bars">a</i>
            </a>
          </div>
          <div className="collapse col-12 d-lg-none text-end" id="nav_header">
            <div className="menu d-none d-lg-block col-lg-9 text-end">
              <Link href="" className='d-inline-block nav-link' id="home_small">HOME</Link>
              <Link href="" className='d-inline-block nav-link' id="help_small">HELP</Link>
              <Link href="" className='d-inline-block nav-link' id="users_small">USERS</Link>
              {/* ログイン時のみ表示 */}
              <Link href="" className='d-inline-block nav-link' id="mypage_small">MYPAGE</Link>
              <Link href="" className='d-inline-block nav-link' id="setting_small">SETTING</Link>
              <Link href="" className='d-inline-block nav-link' id="logout_small">LOGOUT</Link>
              {/* 非ログイン時のみ表示 */}
              <Link href="" className='d-inline-block nav-link' id="login_small">LOGIN</Link>
            </div>
          </div>
      </header>
      <div className="container"> 
        {/* success,errorに応じたメッセージをここで受け取って表示する。各POSTの返り値が使えるか。 */}
      </div>
      <main>{children}</main>
      {!home && (
        <div className="">
          <Link href="/">← ホームに戻る</Link>
        </div>
      )}
    </>
  );
}
