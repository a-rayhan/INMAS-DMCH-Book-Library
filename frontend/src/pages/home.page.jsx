import axios from "axios";
import AnimationWrapper from "../common/page-animation";
import { useContext, useEffect, useState } from "react";
import Loader from "../components/loader.component";
import BookPostCard from "../components/book-post.component";
import NoDataMessage from "../components/nodata.component";
import { filterPaginationData } from "../common/filter-pagination-data";
import LoadMoreDataBtn from "../components/load-more.component";
import { UserContext } from "../App";
import { Navigate } from "react-router-dom";
import InPageNavigation from "../components/inpage-navigation.component";

const HomePage = () => {

    const [books, setBooks] = useState(null);
    const [totalBookLength, setTotalBookLength] = useState(null);
    const [topicLength, setTopicLength] = useState(null);
    const [pageState, setPageState] = useState("home");

    let categories = [];

    const { userAuth } = useContext(UserContext);

    const { access_token } = userAuth;


    const fetchLatestBooks = ({ page = 1 }) => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/latest-books", { page })
            .then(async ({ data }) => {
                let formatedData = await filterPaginationData({
                    state: books,
                    data: data.books,
                    page,
                    countRoute: "/all-latest-books-count"
                })
                setBooks(formatedData);
                setTotalBookLength(formatedData.totalDocs);
            })
            .catch(err => {
                console.log(err);
            })
    }



    const fetchBooksByCategory = ({ page = 1 }) => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-books", { tag: pageState, page })
            .then(async ({ data }) => {
                let formatedData = await filterPaginationData({
                    state: books,
                    data: data.books,
                    page,
                    countRoute: "/search-books-count",
                    data_to_send: { tag: pageState }
                })
                setBooks(formatedData);
                setTopicLength(formatedData.totalDocs)
            })
            .catch(err => {
                console.log(err);
            })
    }

    const loadBlogByCategory = (e) => {
        let category = e.target.innerText.toLowerCase();

        setBooks(null);

        if (pageState == category) {
            setPageState("home");
            return;
        }

        setPageState(category);
    }


    useEffect(() => {

        if (pageState == "home") {
            fetchLatestBooks({ page: 1 });
        } else {
            fetchBooksByCategory({ page: 1 });
        }

    }, [pageState])

    return (
        !access_token ?
            <Navigate to="/signin" /> :
            < AnimationWrapper >
                <section className="h-cover flex flex-col-reverse xl:flex-row justify-center gap-10 mt-5 max-w-[1500px] mx-auto">

                    {/* Home */}
                    <div className="w-full">
                        <InPageNavigation routes={[pageState ? pageState : "home"]}>
                            <>
                                {
                                    pageState !== "home" &&
                                    <div className="-mt-3 pb-4 capitalize mb-8">
                                        <p> {topicLength} Reasults Showing </p>
                                    </div>
                                }


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
                                    fetchDataFun={(pageState == "home" ? fetchLatestBooks : fetchBooksByCategory)}
                                />

                            </>
                        </InPageNavigation>
                    </div>


                    {/* Sidebar */}
                    <div className="w-full xl:max-w-[400px] xl:border border-grey xl:pl-8 pt-3">
                        <div className="flex flex-col xl:gap-10">
                            <div className="pb-3">
                                <h1 className="font-medium text-xl mb-8 flex items-center gap-3">
                                    <i class="fi fi-rr-bookmark text-xl"></i>
                                    Discover for all interests
                                </h1>

                                <div className="flex gap-3 flex-wrap">
                                    {
                                        categories.map((category, i) => {
                                            return (
                                                <button
                                                    onClick={loadBlogByCategory}
                                                    className={"tag " + (pageState == category ? " bg-black text-white" : "")}
                                                    key={i}
                                                >
                                                    {category}
                                                </button>
                                            )
                                        })
                                    }
                                </div>
                            </div>

                            {
                                totalBookLength &&
                                <div className="hidden xl:block">
                                    <div className='pb-3'>
                                        <AnimationWrapper transition={{ duration: 1, delay: 1 * .1 }}>
                                            <div>
                                                <p className='font-medium text-xl mb-7 flex items-center gap-1'>
                                                    <i class="fi fi-rr-chart-histogram text-xl"></i>
                                                    Total books: <span className='font-bold'>{totalBookLength}</span>
                                                </p>
                                            </div>
                                        </AnimationWrapper>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </section>
            </AnimationWrapper >
    );
};

export default HomePage;