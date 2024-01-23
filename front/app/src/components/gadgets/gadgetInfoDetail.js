import Image from 'next/image'
import Link from 'next/link'

import { format } from 'date-fns'

export default function GadgetInfoDetail(props) {
  return (
    <>
      <div className='gadget-detail'>
        <div className='row'>
          <div className='header'>ガジェット名</div>
          <div className='content'>
            <span>
              <Link href={`/gadgets/${props.gadget.id}`}>{props.gadget.name}</Link>
            </span>
          </div>
        </div>
        <div className='row'>
          <div className='header'>カテゴリ</div>
          <div className='content'>
            <span>{props.gadget.category}</span>
          </div>
        </div>
        <div className='row'>
          <div className='header'>型番</div>
          <div className='content'>
            <span className=''>{props.gadget.model_number || '-'}</span>
          </div>
        </div>
        <div className='row'>
          <div className='header'>メーカー</div>
          <div className='content'>
            <span className=''>{props.gadget.manufacturer || '-'}</span>
          </div>
        </div>
        <div className='row'>
          <div className='header'>価格</div>
          <div className='content'>
            {props.gadget.price ? `¥${props.gadget.price.toLocaleString()}` : '-'}
          </div>
        </div>
        <div className='row'>
          <div className='header'>その他スペック</div>
          <div className='content'>
            <span className=''>{props.gadget.other_info || '-'}</span>
          </div>
        </div>
        <div className='row'>
          <div className='header'>投稿者</div>
          <div className='content'>
            <p className='overflow'>
              <Image
                src={
                  props.gadget.user.image.url === 'default.jpg'
                    ? '/images/default.jpg'
                    : props.gadget.user.image.url
                }
                width={60}
                height={60}
                alt='user-image'
              />
              <Link href={`/users/${props.gadget.user.id}`}>{props.gadget.user.name}</Link>
            </p>
          </div>
        </div>
        <div className='row'>
          <div className='header'>最終更新</div>
          <div className='content'>
            <span className='' suppressHydrationWarning>
              {format(new Date(props.gadget.updated_at), 'yyyy/MM/dd HH:mm')}
            </span>
          </div>
        </div>
      </div>
    </>
  )
}
