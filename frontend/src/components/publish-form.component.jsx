import { Toaster, toast } from "react-hot-toast";
import AnimationWrapper from "../common/page-animation";
import { useContext } from "react";
import { EditorContext } from "../pages/editor.pages";
import Tag from "./tags.component";
import axios from "axios";
import { UserContext } from "../App";
import { useNavigate, useParams } from "react-router-dom";

const PublishForm = () => {

    let { book_id } = useParams();

    let tagLimit = 10;

    let { book, book: { title, content, tags, des, serial, writer, type, photo }, setBook, setEditorState } = useContext(EditorContext);

    let { userAuth: { access_token } } = useContext(UserContext);

    let navigate = useNavigate();

    const handleCloseEvent = () => {
        setEditorState("editor")
    }

    const handleBookDesChange = (e) => {
        let input = e.target;

        setBook({ ...book, des: input.value })
    }

    const handleBookSerChange = (e) => {
        let input = e.target;

        setBook({ ...book, serial: input.value })
    }

    const handleBookWriterChange = (e) => {
        let input = e.target;

        setBook({ ...book, writer: input.value })
    }

    const handleTypeChange = (e) => {
        let input = e.target;

        setBook({ ...book, type: input.value })
    }

    const handleBookPhotoChange = (e) => {
        let input = e.target;

        setBook({ ...book, photo: input.value })
    }


    const handleKeyDown = (e) => {
        if (e.keyCode == 13 || e.keyCode == 188) {
            e.preventDefault();

            let tag = e.target.value;

            if (tags.length < tagLimit) {
                if (!tags.includes(tag) && tag.length) {
                    setBook({ ...book, tags: [...tags, tag] })
                }
            }

            e.target.value = "";
        }
    }

    const publishBook = (e) => {

        if (e.target.className.includes("disable")) {
            return;
        }

        if (!title.length) {
            toast.error("Write book title before publishing")
        }

        let loadingToast = toast.loading("Publishing...")

        e.target.classList.add("disable");

        let bookObj = {
            title, des, serial, content, tags, writer, type, photo, draft: false
        }

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/create-book", { ...bookObj, id: book_id }, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        })
            .then(() => {
                e.target.classList.remove("disable");

                toast.dismiss(loadingToast);
                toast.success("Published")

                setTimeout(() => {
                    navigate("/")
                }, 500)
            })
            .catch(({ response }) => {
                e.target.classList.remove("disable");

                toast.dismiss(loadingToast);

                return toast.error(response.data.error);
            })
    }

    return (
        <AnimationWrapper>
            <section className="max-w-[1200px] min-h-screen py-16 mx-auto">

                <Toaster />

                <button
                    onClick={handleCloseEvent}
                    className="w-12 h-12 absolute right-[5vw] z-10 top-[5%] lg:top-[10%]"
                >
                    <i className="fi fi-br-cross"></i>
                </button>

                <div className="border-grey lg:border-1 lg:pl-8">
                    <p className="text-dark-grey mb-2 mt-9">
                        Title
                    </p>

                    <input
                        type="text"
                        placeholder="Book name"
                        defaultValue={title}
                        className="input-box pl-4"
                    />

                    <p className="text-dark-grey mb-2 mt-9">
                        Short Description
                    </p>

                    <textarea
                        defaultValue={des}
                        className="h-40 resize-none input-box pl-4"
                        onChange={handleBookDesChange}
                    />

                    <div className="grid md:grid-cols-3 md:gap-6">
                        <div>
                            <p className="text-dark-grey mb-2 mt-9">
                                Serial
                            </p>

                            <input
                                type="text"
                                placeholder="Serial No."
                                className="input-box pl-4 pb-4"
                                onChange={handleBookSerChange}
                            />
                        </div>

                        <div>
                            <p className="text-dark-grey mb-2 mt-9">
                                Author
                            </p>

                            <input
                                type="text"
                                placeholder="Author"
                                className="input-box pl-4 pb-4"
                                onChange={handleBookWriterChange}
                            />
                        </div>

                        <div>
                            <p className="text-dark-grey mb-2 mt-9">
                                Type
                            </p>

                            <input
                                type="text"
                                placeholder="Book"
                                className="input-box pl-4 pb-4"
                                onChange={handleTypeChange}
                            />
                        </div>
                    </div>

                    <p className="text-dark-grey mb-2 mt-9">
                        Topic
                    </p>

                    <div className="relative input-box pl-2">
                        <input
                            type="text"
                            placeholder="Topic"
                            className="sticky input-box bg-white top-0 left-0 pl-4 mb-3"
                            onKeyDown={handleKeyDown}
                        />

                        {
                            tags.map((tag, i) => {
                                return <Tag tag={tag} tagIndex={i} key={i} />
                            })
                        }
                    </div>

                    <p className="text-dark-grey mb-2 mt-9">
                        Photo
                    </p>

                    <input
                        type="text"
                        placeholder="Photo URL"
                        className="input-box pl-4 pb-4"
                        onChange={handleBookPhotoChange}
                    />

                    <button
                        onClick={publishBook}
                        className="btn-dark px-8 mt-5"
                    >
                        Publish
                    </button>
                </div>

            </section>
        </AnimationWrapper>
    );
};

export default PublishForm;