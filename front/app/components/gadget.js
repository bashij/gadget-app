import GadgetBookmark from '@/components/gadgetBookmark'
import GadgetDetail from '@/components/gadgetDetail'
import GadgetLike from '@/components/gadgetLike'
import ReviewRequest from '@/components/reviewRequest'
import { faUsers } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

export default function Gadget(props) {
  const [reviewRequestCount, setReviewRequestCount] = useState(props.gadget.review_requests.length)

  return (
    <div className='gadget' id={`gadget_${props.gadget.id}`}>
      <div className='gadget-image'>
        <Image
          src={
            props.gadget.image.url == 'default.jpg'
              ? '/images/default.jpg'
              : `https://static.gadgetlink-app.com${props.gadget.image.url}`
          }
          width={150}
          height={150}
          alt='gadget-image'
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
            <span id={`review_request_count_${props.gadget.id}`}>{reviewRequestCount}</span>
          </span>
        </div>
        <div className='review-link'>
          {props.gadget.review.body ? (
            <span id={`review_request_section_${props.gadget.id}`}>
              <Link href={`/gadgets/${props.gadget.id}`}>レビューを見る</Link>
            </span>
          ) : (
            <ReviewRequest
              gadget={props.gadget}
              user={props.user}
              setReviewRequestCount={setReviewRequestCount}
            />
          )}
        </div>
        <div className='review-link'>
          {props.gadget.user_id === props.user ? (
            <Link href={`/gadgets/${props.gadget.id}/edit`}>レビュー編集</Link>
          ) : null}
        </div>
      </div>
      <div className='gadget-content'>
        <GadgetDetail gadget={props.gadget} />
      </div>
    </div>
  )
}
