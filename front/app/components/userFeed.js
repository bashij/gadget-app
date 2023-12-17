import Image from 'next/image'
import Link from 'next/link'

export default function UserFeed(props) {
  return (
    <>
      {props.data?.users?.map((user) => {
        return (
          <div key={user.id} className='user-feed'>
            <div className='user-info'>
              <Image
                src={user.image.url === 'default.jpg' ? '/images/default.jpg' : user.image.url}
                width={150}
                height={150}
                alt='user-image'
              />
              <Link href={`/users/${user.id}`}>
                <div className='user overflow'>{user.name}</div>
              </Link>
            </div>
          </div>
        )
      })}
    </>
  )
}
