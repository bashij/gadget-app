module Pagination
  extend ActiveSupport::Concern

  def paginated_collection(collection, default_limit_value)
    paged = params[:paged]
    per = params[:per].presence || default_limit_value
    collection.page(paged).per(per)
  end

  def pagination_info(records)
    {
      total_count: records.total_count,
      limit_value: records.limit_value,
      total_pages: records.total_pages,
      current_page: records.current_page
    }
  end
end
