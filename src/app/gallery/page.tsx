"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ProductProps } from "@/../type";
import Loading from "@/ui/Loading";
import Container from "@/ui/Container";
import ProductCard from "@/ui/ProductCard";

const LOCAL_STORAGE_KEY = "artworksCurrentPage";

const Artworks = () => {
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pendingPage, setPendingPage] = useState<number | null>(null);
  const productsPerPage = 12;

  // On mount, read saved page from localStorage if valid
  useEffect(() => {
    const savedPage = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedPage) {
      const pageNum = parseInt(savedPage, 10);
      if (!isNaN(pageNum) && pageNum > 0) {
        setCurrentPage(pageNum);
      }
    }
  }, []);

  // Fetch products on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.from('products').select('*');
        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error("Error fetching data,", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Save currentPage to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, currentPage.toString());
  }, [currentPage]);

  // Pagination calculations
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(products.length / productsPerPage);

  // Create array of page numbers
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Effect to handle instant scroll and loading when pendingPage changes
  useEffect(() => {
    if (pendingPage !== null) {
      // Immediately jump to top (no smooth scroll)
      window.scrollTo(0, 0);

      // Show loading overlay for 1 second before updating page
      const timer = setTimeout(() => {
        setCurrentPage(pendingPage);
        setPendingPage(null);
        setLoading(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [pendingPage]);

  // Function to change page with loading and instant scroll
  const changePageWithLoading = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages || pageNumber === currentPage)
      return;

    setLoading(true);
    setPendingPage(pageNumber);
  };

  // Handlers for pagination buttons
  const handlePageChange = (pageNumber: number) => {
    changePageWithLoading(pageNumber);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      changePageWithLoading(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      changePageWithLoading(currentPage - 1);
    }
  };

  return (
    <div>
      {/* Loading overlay */}
      {loading && (
        <div>
          <Loading />
        </div>
      )}

      {/* Content only visible when not loading */}
      {!loading && (
        <Container>
          <div className="flex items-center flex-col md:items-center gap-10 md:py-10">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold mb-8 text-center text-gray-900">
                Art Collection
              </h1>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5 lg:gap-8 items-start place-items-center">
                {currentProducts.map((item: ProductProps) => (
                  <ProductCard item={item} key={item?._id} />
                ))}
              </div>

              {products.length > productsPerPage && (
                <div className="flex justify-center items-center gap-4 mt-8">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-gray-300"
                  >
                    Previous
                  </button>

                  <div className="flex gap-2">
                    {pageNumbers.map((number) => (
                      <button
                        key={number}
                        onClick={() => handlePageChange(number)}
                        className={`px-3 py-2 rounded-md transition-colors ${
                          currentPage === number
                            ? "bg-gray-900 text-white px-3 py-2 rounded-r-md text-sm font-semibold hover:bg-gray-800"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        {number}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-gray-300"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </Container>
      )}
    </div>
  );
};

export default Artworks;
