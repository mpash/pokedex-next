import {
  createContext,
  RefObject,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react'

type PaginationContext = {
  currentPage: number
  totalPages: number
  setTotalPages: (totalPages: number) => void
  onPageChange: (page: number) => void
  onPreviousPage: () => void
  onNextPage: () => void
  itemsPerPage: number
  setItemsPerPage: (itemsPerPage: number) => void
  containerRef: RefObject<HTMLDivElement>
  scrollToTop: () => void
}

const PaginationContext = createContext<PaginationContext>(null as any)

export const PaginationProvider = ({ children }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(100)
  const containerRef = useRef<HTMLDivElement>(null)

  const scrollToTop = useCallback(() => {
    if (containerRef.current) {
      containerRef?.current?.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [containerRef])

  const onPageChange = useCallback(
    (page: number) => {
      scrollToTop()
      setCurrentPage(page)
    },
    [scrollToTop],
  )

  const onPreviousPage = useCallback(() => {
    scrollToTop()
    setCurrentPage(currentPage - 1 >= 1 ? currentPage - 1 : 1)
  }, [currentPage, scrollToTop])

  const onNextPage = useCallback(() => {
    scrollToTop()
    setCurrentPage(currentPage + 1 <= totalPages ? currentPage + 1 : totalPages)
  }, [currentPage, scrollToTop, totalPages])

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
        scrollToTop,
        containerRef,
      }}
    >
      {children}
    </PaginationContext.Provider>
  )
}

export const usePagination = () => useContext(PaginationContext)
