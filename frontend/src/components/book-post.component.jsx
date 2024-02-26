import { Link } from "react-router-dom";
import { getFullDay } from "../common/date";

const BookPostCard = ({ content }) => {


    let { publishedAt, tags, title, des, serial, writer, type, photo, book_id: id } = content;

    return (
        <Link to={`/book/${id}`}
            className="flex gap-8 items-center border-b border-grey pb-5 mb-4"
        >
            <div className="w-full">
                <h1 className="blog-title">
                    {title}
                </h1>

                <p className="my-3 text-xl font-gelasio leading-7 line-clamp-2">
                    {des}
                </p>

                <div className="flex items-center gap-3 mt-4">
                    {
                        writer &&
                        <>
                            <p className="flex items-center font-medium gap-2">
                                <i className="fi fi-rr-file-edit"></i>
                                {writer}
                            </p>

                            <div className="w-1 h-1 bg-dark-grey rounded-full" />
                        </>
                    }

                    {
                        serial &&
                        <p className="font-medium">
                            Serial No {serial}
                        </p>
                    }
                </div>

                <div className="flex items-center flex-wrap gap-4 mt-5">

                    <p className="text-dark-grey text-sm">
                        {getFullDay(publishedAt)}
                    </p>

                    {
                        type &&
                        <p className="flex items-center text-dark-grey text-sm gap-2">
                            <i class="fi fi-rr-book-alt"></i>
                            {type == "Book" ? "Book" : type}
                        </p>
                    }

                    {
                        tags.length ? <span className="btn-light py-[3px] px-4 text-[14px]">{tags[0]}</span> : ""
                    }
                </div>


            </div>

            {/* {
                photo ?
            <div className="h-40 aspect-square hidden md:block">
                <img src={photo} alt="" className="rounded-md" />
            </div> : ""
            } */}
        </Link>
    );
};

export default BookPostCard;