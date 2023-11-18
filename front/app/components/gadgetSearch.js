import { useEffect, useState } from 'react'

import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import 'react-toastify/dist/ReactToastify.css'

export default function GadgetSearch(props) {
  const [showReply, setShowReply] = useState(false)
  const handleToggle = () => {
    setShowReply(!showReply)
  }

  // 検索条件を入力する度に１ページ目に戻す
  useEffect(() => {
    props.setPageIndex(1)
  }, [props.filters])

  return (
    <>
      <span className='search-icon' onClick={handleToggle}>
        <FontAwesomeIcon className='pe-2' icon={faSearch} />
        ガジェット検索
      </span>
      <div className={`row search-area ${showReply ? 'visible' : 'hidden'}`}>
        <div className='col-lg-8 col-sm-10'>
          <div className='mb-3'>
            <label className='form-label' htmlFor='name'>
              ガジェット名
            </label>
            <input
              type='text'
              className='form-control'
              name='name'
              value={props.filters.name}
              onChange={(e) => props.setFilters({ ...props.filters, name: e.target.value })}
              id='name'
            />
          </div>
          <div className='mb-3'>
            <label className='form-label' htmlFor='category'>
              カテゴリ
            </label>
            <select
              type='text'
              className='form-control'
              name='category'
              value={props.filters.category}
              onChange={(e) => props.setFilters({ ...props.filters, category: e.target.value })}
              id='category'
            >
              <option value=''>選択してください</option>
              <option value='PC本体'>PC本体</option>
              <option value='モニター'>モニター</option>
              <option value='キーボード'>キーボード</option>
              <option value='マウス'>マウス</option>
              <option value='オーディオ'>オーディオ</option>
              <option value='デスク'>デスク</option>
              <option value='チェア'>チェア</option>
              <option value='その他'>その他</option>
            </select>
          </div>
          <div className='mb-3'>
            <label className='form-label' htmlFor='model_number'>
              型番
            </label>
            <input
              type='text'
              className='form-control'
              name='model_number'
              value={props.filters.model_number}
              onChange={(e) => props.setFilters({ ...props.filters, model_number: e.target.value })}
              id='model_number'
            />
          </div>
          <div className='mb-3'>
            <label className='form-label' htmlFor='manufacturer'>
              メーカー
            </label>
            <input
              type='text'
              className='form-control'
              name='manufacturer'
              value={props.filters.manufacturer}
              onChange={(e) => props.setFilters({ ...props.filters, manufacturer: e.target.value })}
              id='manufacturer'
            />
          </div>
          <div className='mb-3'>
            <label className='form-label' htmlFor='price'>
              価格
            </label>
            <div className='search-price-area'>
              <input
                type='number'
                className='form-control price-form'
                name='price_minimum'
                value={props.filters.price_minimum}
                onChange={(e) =>
                  props.setFilters({ ...props.filters, price_minimum: e.target.value })
                }
                id='price_minimum'
              />
              <div className='price-range'>〜</div>
              <input
                type='number'
                className='form-control price-form'
                name='price_maximum'
                value={props.filters.price_maximum}
                onChange={(e) =>
                  props.setFilters({ ...props.filters, price_maximum: e.target.value })
                }
                id='price_maximum'
              />
            </div>
          </div>
          <div className='mb-3'>
            <label className='form-label' htmlFor='other_info'>
              その他スペック
            </label>
            <input
              type='text'
              className='form-control'
              name='other_info'
              value={props.filters.other_info}
              onChange={(e) => props.setFilters({ ...props.filters, other_info: e.target.value })}
              id='other_info'
            />
          </div>
          <div className='mb-3'>
            <label className='form-label' htmlFor='review'>
              レビュー
            </label>
            <input
              type='text'
              className='form-control'
              name='review'
              value={props.filters.review}
              onChange={(e) => props.setFilters({ ...props.filters, review: e.target.value })}
              id='review'
            />
          </div>
          <div className='mb-3'>
            <label className='form-label' htmlFor='sort_condition'>
              並び替え
            </label>
            <select
              type='text'
              className='form-control'
              name='sort_condition'
              value={props.filters.sort_condition}
              onChange={(e) =>
                props.setFilters({ ...props.filters, sort_condition: e.target.value })
              }
              id='sort_condition'
            >
              <option value='更新が新しい順'>更新が新しい順</option>
              <option value='更新が古い順'>更新が古い順</option>
              <option value='価格が安い順'>価格が安い順</option>
              <option value='価格が高い順'>価格が高い順</option>
            </select>
          </div>
        </div>
        <div className='content-header'>
          <p className='text-center'>
            {props.isLoading ? '検索しています...' : `該当件数 ${props.searchResultCount}件`}
          </p>
        </div>
      </div>
    </>
  )
}
