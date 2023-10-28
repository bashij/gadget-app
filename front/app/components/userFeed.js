import Image from 'next/image'
import Link from 'next/link'

export default function UserFeed(props) {
  return (
    <>
      {props.data?.users?.map((user) => {
        return (
          <div key={user.id} className='user-feed p-3 m-1'>
            <div className='user-info text-center me-2'>
              <Image
                src={user.image.url === 'default.jpg' ? '/images/default.jpg' : user.image.url}
                width={150}
                height={150}
                alt='user-image'
              />
              <Link href={`/users/${user.id}`}>
                <div className='user mt-2'>{user.name}</div>
              </Link>
            </div>
          </div>
        )
      })}
    </>
  )
}
