import { useEffect, useState } from 'react'

import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { faPenToSquare, faUsers } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import DOMPurify from 'dompurify'
import { marked } from 'marked'
import { toast, ToastContainer } from 'react-toastify'
import useSWR, { useSWRConfig } from 'swr'

import Comment from '@/components/comment'
import CommentForm from '@/components/commentForm'
import GadgetBookmark from '@/components/gadgetBookmark'
import GadgetDelete from '@/components/gadgetDelete'
import GadgetInfoDetail from '@/components/gadgetInfoDetail'
import GadgetLike from '@/components/gadgetLike'
import Layout, { siteTitle } from '@/components/layout'
import Pagination from '@/components/pagination'
import ReviewRequest from '@/components/reviewRequest'
import apiClient from '@/utils/apiClient'
import 'easymde/dist/easymde.min.css'
import 'highlight.js/styles/github.css'

import 'react-toastify/dist/ReactToastify.css'

const fetcher = (url) => fetch(url).then((r) => r.json())

export default function Gadget(props) {
  const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT_GADGETS
  const [pageIndex, setPageIndex] = useState(1)
  const { mutate } = useSWRConfig()
  const { data, error, isLoading } = useSWR(
    `${API_ENDPOINT}/${props.gadget.id}/comments?paged=${pageIndex}`,
    fetcher,
    {
      keepPreviousData: true,
      revalidateOnFocus: false,
    },
  )

  const router = useRouter()
  const [message, setMessage] = useState([router.query.message])
  const [status, setStatus] = useState(router.query.status)
  const [replyFormId, setReplyFormId] = useState()

  const [reviewRequestCount, setReviewRequestCount] = useState(props.gadget.review_requests.length)

  const [isPageDeleted, setIsPageDeleted] = useState(false)

  // コメント新規作成時
  useEffect(() => {
    // Statusを初期化
    setStatus()
    if (status === 'success') {
      if (isPageDeleted) {
        router.push(
          {
            pathname: '/gadgets',
            query: { message: message, status: status },
          },
          `/gadgets/`,
        )
      } else {
        // フォームを初期化
        replyFormId
          ? document.getElementById(`reply_form_${replyFormId}`)?.reset()
          : document.getElementById('comment_form')?.reset()
        // ReplyFormIdを初期化
        setReplyFormId()

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
    }

    if (status === 'failure') {
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

    if (status === 'notLoggedIn') {
      router.push(
        {
          pathname: '/login',
          query: { message: message, status: status },
        },
        '/login',
      )
    }
  }, [status])

  useEffect(() => {
    // レビューが存在する場合のみ処理を行う
    if (!props.gadget.review) {
      return
    }
    // マークダウンで許可するタグと属性を規定
    const allowedTags = [
      'strong',
      'em',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'blockquote',
      'a',
      'p',
      'ul',
      'ol',
      'li',
      'img',
    ]
    const allowedAttributes = ['href', 'cite', 'src', 'alt', 'target']
    // 規定に沿ってレビューをエスケープ
    const sanitizeMarkdown = () => {
      // 引用の'>'を復元してから、マークダウン形式をHTML形式に変換する
      const originalReview = props.gadget.review.replace(/&gt;/g, '>')
      const sanitizedHtml = DOMPurify.sanitize(marked(originalReview), {
        ALLOWED_TAGS: allowedTags,
        ALLOWED_ATTR: allowedAttributes,
      })
      return { __html: sanitizedHtml }
    }
    // レビューをHTML形式で表示
    document.querySelector('#review').innerHTML = sanitizeMarkdown().__html
  }, [])

  // サーバーサイドでエラーが発生した場合はエラーメッセージを表示して処理を終了する
  if (props.errorMessage) return props.errorMessage

  if (error) return <div>エラーが発生しました。時間をおいて再度お試しください。</div>

  if (data || isLoading) {
    return (
      <Layout user={props.user} pageName={'gadget'}>
        <Head>
          <title>
            {siteTitle} | {props.gadget.name}
          </title>
        </Head>
        <ToastContainer />
        <div className='row justify-content-center'>
          <div className='col-12 col-xl-10'>
            <div id={`gadget_${props.gadget.id}`} className='gadget'>
              <div className='gadget-image-detail'>
                <Image
                  src={
                    props.gadget.image.url === 'default.jpg'
                      ? '/images/default.jpg'
                      : props.gadget.image.url
                  }
                  width={150}
                  height={150}
                  alt='gadget-image'
                  className='card-img-top'
                />
                <div className='review-icons'>
                  <span id={`like_section_${props.gadget.id}`} className='review-icon'>
                    <GadgetLike gadget={props.gadget} user={props.user} />
                  </span>
                  <span id={`bookmark_section_${props.gadget.id}`} className='review-icon'>
                    <GadgetBookmark gadget={props.gadget} user={props.user} />
                  </span>
                  <span className='review-icon'>
                    <Link href={`/gadgets/${props.gadget.id}/review_requests`}>
                      <FontAwesomeIcon className='icon-post' icon={faUsers} />
                    </Link>
                    <span data-testid={`review_request_count_${props.gadget.id}`}>
                      {reviewRequestCount}
                    </span>
                  </span>
                </div>
                {props.user && props.gadget.user_id === props.user.id ? (
                  <div className='edit-links'>
                    <div className='link-section'>
                      <Link href={`/gadgets/${props.gadget.id}/edit`}>
                        <FontAwesomeIcon icon={faPenToSquare} />
                        ガジェットとレビューを編集
                      </Link>
                    </div>
                    <GadgetDelete
                      gadget={props.gadget}
                      setMessage={setMessage}
                      setStatus={setStatus}
                      setIsPageDeleted={setIsPageDeleted}
                    />
                  </div>
                ) : null}
              </div>
              <div className='gadget-content'>
                <GadgetInfoDetail gadget={props.gadget} />
              </div>
            </div>
            <div className='review-header'>
              <p className='review'>レビュー</p>
              <div className='review-content'>
                {props.gadget.review ? (
                  <div id='review'></div>
                ) : (
                  <div>
                    <h3>レビューはまだありません。</h3>
                    <div className='review-link'>
                      {props.user && props.gadget.user_id === props.user.id ? (
                        <Link href={`/gadgets/${props.gadget.id}/edit`}>
                          <FontAwesomeIcon icon={faPenToSquare} />
                          ガジェットとレビューを編集
                        </Link>
                      ) : (
                        <ReviewRequest
                          gadget={props.gadget}
                          user={props.user}
                          setReviewRequestCount={setReviewRequestCount}
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className='content-header'>
              <p>コメント</p>
            </div>
            <CommentForm
              gadget={props.gadget}
              setMessage={setMessage}
              setStatus={setStatus}
              placeholder={'新しいコメント'}
              mutate={mutate}
              swrKey={`${API_ENDPOINT}/${props.gadget.id}/comments?paged=${pageIndex}`}
            />
            <div id='feed_comment' className='posts'>
              {data?.comments?.map((comment) => {
                return (
                  <Comment
                    key={comment.id}
                    comment={comment}
                    gadget={props.gadget}
                    user={props.user}
                    replies={data.replies}
                    replyCount={data.replyCounts[comment.id]}
                    mutate={mutate}
                    swrKey={`${API_ENDPOINT}/${props.gadget.id}/comments?paged=${pageIndex}`}
                    setMessage={setMessage}
                    setStatus={setStatus}
                    setReplyFormId={setReplyFormId}
                  />
                )
              })}
            </div>
            <div className='pagination'>
              {data && !data.comments ? (
                <p>エラーが発生しました。時間をおいて再度お試しください。</p>
              ) : data?.comments.length > 0 ? (
                <Pagination data={data} pageIndex={pageIndex} setPageIndex={setPageIndex} />
              ) : isLoading ? (
                <p>データを読み込んでいます...</p>
              ) : (
                <p>コメントはまだありません</p>
              )}
            </div>
          </div>
        </div>
      </Layout>
    )
  }
}

export const getServerSideProps = async (context) => {
  try {
    // ログインユーザー情報を取得
    const cookie = context.req?.headers.cookie
    const responseUser = await apiClient.get(process.env.API_ENDPOINT_CHECK_SESSION, {
      headers: {
        cookie: cookie,
      },
    })
    const user = await responseUser.data.user

    // ガジェット詳細情報を取得
    const id = context.params.id
    const responseGadget = await apiClient.get(`${process.env.API_ENDPOINT_GADGETS}/${id}`, {
      headers: {
        cookie: cookie,
      },
    })
    const gadget = await responseGadget.data.gadget

    return { props: { user: user, gadget: gadget } }
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
