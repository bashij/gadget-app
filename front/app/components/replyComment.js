import CommentDelete from '@/components/commentDelete'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { ja } from 'date-fns/locale'
import Image from 'next/image'
import Link from 'next/link'

export default function ReplyComment(props) {
  return (
    <div className={`reply ${props.latest ? `latest ${latestClass}` : ''}`}>
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
    </div>
  )
}
