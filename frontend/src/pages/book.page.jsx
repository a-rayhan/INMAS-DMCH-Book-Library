import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AnimationWrapper from "../common/page-animation";
import Loader from "../components/loader.component";
import { getDay } from "../common/date";
import BookPostCard from "../components/book-post.component";
import BookContent from "../components/book-content.component";


export const bookStructure = {
    title: '',
    des: '',
    content: [],
    author: { personal_info: {} },
    publishedAt: ''
}

export const BookContext = createContext({})

const BookPage = () => {

    let { book_id } = useParams();

    const [book, setBook] = useState(bookStructure);
    console.log(book);
    const [similarBooks, setSimilarBooks] = useState(null);
    const [loading, setLoading] = useState(true)

    let { title, content, publishedAt, serial, tags, writer, photo } = book;

    const fetchBook = () => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-book", { book_id })
            .then(async ({ data: { book } }) => {
                setBook(book)
                axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-books", { tag: book.tags[0], limit: 6, eliminate_book: book_id })
                    .then(({ data }) => {
                        setSimilarBooks(data.books)
                    })
                setLoading(false)
            })

            .catch(err => {
                setLoading(false)
            })
    }

    useEffect(() => {

        resetStates();

        fetchBook()

    }, [book_id])

    const resetStates = () => {
        setBook(bookStructure);
        setSimilarBooks(null);
        setLoading(true);
    }

    return (
        <AnimationWrapper>
            {
                loading ? <Loader /> :
                    <BookContext.Provider value={{ book, setBook }}>

                        <div className="max-w-[900px] center py-10 max-lg:px-[5vw]">
                            <div className="lg:mt-12 pb-6 flex flex-col md:flex-row gap-8">
                                {/* <div>
                                    <img src={photo} alt="" className="h-52 aspect-square object-cover rounded-xl" />
                                </div> */}

                                <div>
                                    <span className="bg-black text-white px-5 py-2 text-xl font-medium rounded">
                                        Serial No: {serial}
                                    </span>
                                    <h2 className="text-3xl lg:text-4xl font-bold my-4">
                                        {title}
                                    </h2>

                                    <div className="mt-4">
                                        {
                                            writer &&
                                            <p className="flex items-center font-medium gap-2">
                                                By {writer}
                                            </p>
                                        }
                                    </div>

                                    <div className="flex items-center flex-wrap gap-4 mt-5">

                                        <p className="text-dark-grey text-sm">
                                            {getDay(publishedAt)}
                                        </p>

                                        <p className="flex items-center text-dark-grey text-sm gap-2">
                                            <i class="fi fi-rr-book-alt"></i>
                                            Book
                                        </p>

                                        {
                                            tags.length ? <span className="btn-light py-[3px] px-4 text-[14px]">{tags[0]}</span> : ""
                                        }
                                    </div>
                                </div>
                            </div>

                            <div>
                                {
                                    content[0].blocks.map((block, i) => {
                                        return <div key={i} className="my-4 md:my-8 font-gelasio">
                                            <BookContent block={block} />
                                        </div>
                                    })
                                }
                            </div>

                            <p className="my-6">
                                This book copy reserved in INMAS ~ DMCH library. <br className="hidden md:block" /> Find the book <span className="font-medium underline">Serial no {serial}</span> inside the bookshelf in library.
                            </p>

                            {
                                similarBooks !== null && similarBooks.length ?
                                    <>
                                        <h1 className="text-2xl mt-14 mb-10 font-medium">
                                            Similar Books
                                        </h1>

                                        {
                                            similarBooks.map((book, i) => {
                                                return <AnimationWrapper key={i} transition={{ duration: 1, delay: i * 0.08 }}>
                                                    <BookPostCard content={book} />
                                                </AnimationWrapper>
                                            })
                                        }
                                    </>
                                    : ""
                            }
                        </div>
                    </BookContext.Provider>
            }
        </AnimationWrapper>
    );
};

export default BookPage;