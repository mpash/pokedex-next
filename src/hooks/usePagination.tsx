import { createContext, useCallback, useContext, useState } from 'react'

type PaginationContext = {
  currentPage: number
  totalPages: number
  setTotalPages: (totalPages: number) => void
  onPageChange: (page: number) => void
  onPreviousPage: () => void
  onNextPage: () => void
  itemsPerPage: number
  setItemsPerPage: (itemsPerPage: number) => void
}

const PaginationContext = createContext<PaginationContext>(null as any)

export const PaginationProvider = ({ children }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(52)

  const onPageChange = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  const onPreviousPage = useCallback(() => {
    setCurrentPage(currentPage - 1 >= 1 ? currentPage - 1 : 1)
  }, [currentPage])

  const onNextPage = useCallback(() => {
    setCurrentPage(currentPage + 1 <= totalPages ? currentPage + 1 : totalPages)
  }, [currentPage, totalPages])

  return (
    <PaginationContext.Provider
      value={{
        currentPage,
        setTotalPages,
        totalPages,
        onPageChange,
        onPreviousPage,
        onNextPage,
        itemsPerPage,
        setItemsPerPage,
      }}
    >
      {children}
    </PaginationContext.Provider>
  )
}

export const usePagination = () => useContext(PaginationContext)
