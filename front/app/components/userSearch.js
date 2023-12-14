import { useEffect, useState } from 'react'

import { faSearch, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import 'react-toastify/dist/ReactToastify.css'

export default function UserSearch(props) {
  const [showSearchArea, setShowSearchArea] = useState(false)

  useEffect(() => {
    // 入力値が存在する場合は、検索条件入力欄を初期表示する
    if (Object.values(props.filters).every((value) => value === '')) {
      setShowSearchArea(false)
    } else {
      setShowSearchArea(true)
    }
  }, [])

  const handleToggle = () => {
    setShowSearchArea(!showSearchArea)
  }

  const handleClear = () => {
    localStorage.removeItem(props.filterName)
    props.setFilters({
      name: '',
      job: '',
      sort_condition: '',
    })
  }

  useEffect(() => {
    // 検索条件をローカルストレージに保存する
    localStorage.setItem(props.filterName, JSON.stringify(props.filters))
    // 検索条件を入力する度に１ページ目に戻す
    props.setPageIndex(1)
  }, [props.filters])

  return (
    <>
      <span className='search-icon' onClick={handleToggle}>
        <FontAwesomeIcon className='pe-2' icon={faSearch} />
        ユーザー検索
      </span>
      <div className={`row search-area ${showSearchArea ? 'visible' : 'hidden'}`}>
        <div className='col-lg-8 col-sm-10'>
          <div className='mb-3'>
            <label className='form-label' htmlFor='name'>
              ユーザー名
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
            <label className='form-label' htmlFor='job'>
              職業
            </label>
            <select
              type='text'
              className='form-control'
              name='job'
              value={props.filters.job}
              onChange={(e) => props.setFilters({ ...props.filters, job: e.target.value })}
              id='job'
            >
              <option value=''>選択してください</option>
              <option value='IT系'>IT系</option>
              <option value='非IT系'>非IT系</option>
              <option value='学生'>学生</option>
              <option value='YouTuber/ブロガー'>YouTuber/ブロガー</option>
              <option value='その他'>その他</option>
            </select>
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
              {props.filterName === 'recommendedUserFilters' ? (
                <>
                  <option value='おすすめ順'>おすすめ順</option>
                </>
              ) : (
                <>
                  <option value='更新が新しい順'>更新が新しい順</option>
                  <option value='更新が古い順'>更新が古い順</option>
                </>
              )}
            </select>
          </div>
          <span className='search-icon trash' onClick={handleClear}>
            <FontAwesomeIcon className='pe-2' icon={faTrashAlt} />
            検索条件をクリア
          </span>
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
