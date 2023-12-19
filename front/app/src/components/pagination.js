export default function Pagination(props) {
  const totalPages = props.data?.pagination.total_pages
  const currentPage = props.data?.pagination.current_page
  const previousArrow = currentPage > 1 ? currentPage - 1 : currentPage
  const nextArrow = currentPage + 1 <= totalPages ? currentPage + 1 : currentPage

  return (
    <>
      {/* << 最初のページ */}
      <button className='' onClick={() => props.setPageIndex(1)}>
        &lt;&lt;
      </button>
      {/* < 前のページ */}
      <button onClick={() => props.setPageIndex(previousArrow)}>&lt;</button>
      <button
        className={currentPage > 1 ? '' : 'hidden'}
        onClick={() => props.setPageIndex(props.pageIndex - 1)}
      >
        {currentPage > 1 ? currentPage - 1 : ''}
      </button>
      {/* 現在のページ */}
      <button className='active'>{currentPage}</button>
      {/* > 次のページ */}
      <button
        className={currentPage + 1 <= totalPages ? '' : 'hidden'}
        onClick={() => props.setPageIndex(props.pageIndex + 1)}
      >
        {currentPage + 1 <= totalPages ? currentPage + 1 : ''}
      </button>
      <button onClick={() => props.setPageIndex(nextArrow)}>&gt;</button>
      {/* >> 最後のページ */}
      <button onClick={() => props.setPageIndex(totalPages)}>&gt;&gt;</button>
    </>
  )
}
