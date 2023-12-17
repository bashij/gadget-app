import { useState } from 'react'

import Image from 'next/image'
import Link from 'next/link'

import CommunityMembership from '@/components/communityMembership'

export default function Community(props) {
  const [membershipCount, setMembershipCount] = useState(props.community.memberships.length)

  return (
    <div key={props.community.id} className='col-md-3 community-items card p-3 pb-2 m-2'>
      <Image
        src={
          props.community.image.url === 'default.jpg'
            ? '/images/default.jpg'
            : props.community.image.url
        }
        width={150}
        height={150}
        alt='community-image'
        className='card-img-top'
      />
      <div className='text-center'>
        <Link href={`/communities/${props.community.id}`} className='card-title'>
          {props.community.name}
        </Link>
        <CommunityMembership
          community={props.community}
          user={props.user}
          setMembershipCount={setMembershipCount}
        />
        <div>( {membershipCount} 人 )</div>
      </div>
    </div>
  )
}
