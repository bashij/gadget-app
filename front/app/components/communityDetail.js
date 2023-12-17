import Image from 'next/image'
import Link from 'next/link'

import { format } from 'date-fns'

export default function CommunityDetail(props) {
  return (
    <div className='details'>
      <div className='row'>
        <div className='header'>コミュニティ名</div>
        <div className='content'>
          <span>
            <Link href={`/communities/${props.community.id}`}>{props.community.name}</Link>
          </span>
        </div>
      </div>
      <div className='row'>
        <div className='header'>参加人数</div>
        <div className='content'>
          <span id={`membership_count_${props.community.id}`}>{props.membershipCount} 人</span>
        </div>
      </div>
      <div className='row'>
        <div className='header'>作成者</div>
        <div className='content'>
          <p className='overflow'>
            <Image
              src={
                props.community.user.image.url === 'default.jpg'
                  ? '/images/default.jpg'
                  : props.community.user.image.url
              }
              width={50}
              height={50}
              alt='user-image'
            />
            <Link href={`/users/${props.community.user.id}`}>{props.community.user.name}</Link>
          </p>
        </div>
      </div>
      <div className='row'>
        <div className='header'>作成日時</div>
        <div className='content'>
          <span className='' suppressHydrationWarning>
            {format(new Date(props.community.created_at), 'yyyy/MM/dd HH:mm')}
          </span>
        </div>
      </div>
    </div>
  )
}
