import CommunityMembership from '@/components/communityMembership'
import Image from 'next/image'
import Link from 'next/link'

export default function Community(props) {
  return (
    <div key={props.community.id} className='col-md-3 community-items card p-3 pb-2 m-2'>
      <Image
        src={
          props.community.image.url == 'default.jpg'
            ? '/images/default.jpg'
            : `https://static.gadgetlink-app.com${props.community.image.url}`
        }
        width={150}
        height={150}
        alt='community-image'
        className='card-img-top'
      />
      <div className='card-body text-center'>
        <Link href='' className='card-title'>
          {props.community.name}
        </Link>
        <CommunityMembership community={props.community} user={props.user} />
      </div>
    </div>
  )
}
