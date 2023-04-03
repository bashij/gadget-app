import CommentDelete from '@/components/commentDelete'
import CommentForm from '@/components/commentForm'
import ReplyComment from '@/components/replyComment'
import { faReply } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { ja } from 'date-fns/locale'
import Image from 'next/image'
import Link from 'next/link'
import { useRef, useState } from 'react'

export default function Comment(props) {
  const relatedReplies = props.replies?.filter((reply) => reply.parent_id === props.comment.id)

  const [isOpen, setIsOpen] = useState(false)
  const replyRef = useRef(null)
  const [replyHeight, setReplyHeight] = useState(0)

  const toggleAccordion = () => {
    if (!isOpen) {
      setReplyHeight(replyRef.current.scrollHeight)
    }
    setIsOpen(!isOpen)
  }

  const replyStyle = {
    height: isOpen ? replyHeight : 0,
  }

  const [showReply, setShowReply] = useState(false)
  const handleToggle = () => {
    setShowReply(!showReply)
  }

  return (
    <div className={`parent-post ${props.latest ? `latest ${latestClass}` : ''}`}>
      <div className='post' id={`tweet_${props.comment.id}`}>
        <div className='tweet-section-left'>
          <div className='user-info'>
            <Image
              src={
                props.comment.user.image.url == 'default.jpg'
                  ? '/images/default.jpg'
                  : `https://static.gadgetlink-app.com${props.comment.user.image.url}`
              }
              width={150}
              height={150}
              alt='user-image'
            />
            <div className='user'>
              <Link href={`users/${props.comment.user}`}>{props.comment.user.name}</Link>：
              {props.comment.id}
            </div>
          </div>
        </div>
        <div className='post-content tweet-section-right'>
          <div className='tweet-icons'>
            <span className='tweet-icon'>
              {formatDistanceToNow(new Date(props.comment.created_at), {
                addSuffix: true,
                locale: ja,
              })}
            </span>
            <span className='tweet-icon'>
              <FontAwesomeIcon className='icon-post' icon={faReply} onClick={toggleAccordion} />
            </span>
            {props.user && props.comment.user_id === props.user.id ? (
              <CommentDelete
                comment={props.comment}
                gadget={props.gadget}
                user={props.user}
                mutate={props.mutate}
                swrKey={props.swrKey}
                setMessage={props.setMessage}
                setStatus={props.setStatus}
              />
            ) : null}
          </div>
          <div className='horizontal-rule'></div>
          <div className='p-2'>
            <span className='content text-break'>{props.comment.content}</span>
          </div>
        </div>
      </div>
      <section
        ref={replyRef}
        style={replyStyle}
        className={`reply-section ${isOpen ? 'open' : 'closed'}`}
      >
        <CommentForm
          gadget={props.gadget}
          comment={props.comment}
          setMessage={props.setMessage}
          setStatus={props.setStatus}
          setReplyFormId={props.setReplyFormId}
          placeholder={'返信内容を入力'}
          mutate={props.mutate}
          swrKey={props.swrKey}
        />
      </section>
      <div>
        {props.replyCount !== undefined && props.replyCount !== 0 ? (
          <span className='reply-count' onClick={handleToggle}>
            {props.replyCount}件のリプライ
          </span>
        ) : null}
      </div>
      <div className={`reply-content ${showReply ? 'visible' : 'hidden'}`}>
        {relatedReplies?.map((reply) => {
          return (
            <ReplyComment
              key={reply.id}
              comment={reply}
              gadget={props.gadget}
              user={props.user}
              replies={null}
              replyCounts={null}
              data={props.data}
              mutate={props.mutate}
              swrKey={props.swrKey}
              setMessage={props.setMessage}
              setStatus={props.setStatus}
            />
          )
        })}
      </div>
    </div>
  )
}