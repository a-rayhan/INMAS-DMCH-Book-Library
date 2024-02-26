import { useParams } from "react-router-dom";
import InPageNavigation from "../components/inpage-navigation.component";
import AnimationWrapper from "../common/page-animation";
import BookPostCard from "../components/book-post.component";
import NoDataMessage from "../components/nodata.component";
import LoadMoreDataBtn from "../components/load-more.component";
import Loader from "../components/loader.component";
import axios from "axios";
import { filterPaginationData } from "../common/filter-pagination-data";
import { useEffect, useState } from "react";

const SearchPage = () => {
    const [books, setBooks] = useState(null);
    const [length, setLength] = useState(null);

    let { query } = useParams();

    const searchBooks = ({ page = 1, create_new_arr = false }) => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-books", { query, page })
            .then(async ({ data }) => {
                let formatedData = await filterPaginationData({
                    state: books,
                    data: data.books,
                    page,
                    countRoute: "/search-books-count",
                    data_to_send: { query }
                })
                setBooks(formatedData);
                setLength(formatedData.totalDocs);
            })
            .catch(err => {
                console.log(err);
            })
    }

    useEffect(() => {
        resetState();
        searchBooks({ page: 1, create_new_arr: true })
    }, [query])

    const resetState = () => {
        setBooks(null);
    }

    return (
        <section className="h-cover flex justify-center gap-10">

            <div className="w-full">
                <InPageNavigation routes={[`${length} search Results from "${query}"`]}>
                    <>
                        {
                            books == null ? <Loader /> :
                                (books.results.length ?
                                    books.results.map((book, i) => {
                                        return (
                                            <AnimationWrapper
                                                transition={{ duration: 1, delay: i * .1 }}
                                                key={i}
                                            >
                                                <BookPostCard
                                                    content={book}
                                                />
                                            </AnimationWrapper>
                                        )
                                    }) :
                                    <NoDataMessage message="No books here" />
                                )
                        }

                        <LoadMoreDataBtn
                            state={books}
                            fetchDataFun={searchBooks}
                        />
                    </>
                </InPageNavigation>
            </div>
        </section>
    );
};

export default SearchPage;