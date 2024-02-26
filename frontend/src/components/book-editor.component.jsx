import { Link } from 'react-router-dom';
import logo from '../imgs/logo.png';
import AnimationWrapper from '../common/page-animation';
import { useContext, useEffect } from 'react';
import { EditorContext } from '../pages/editor.pages';
import EditorJS from '@editorjs/editorjs';
import { tools } from './tools.component';
import { Toaster, toast } from "react-hot-toast";

const BookEditor = () => {

    let { book, book: { title, content }, setBook, textEditor, setTextEditor, setEditorState } = useContext(EditorContext);

    const handleTitleKeyDown = (e) => {
        if (e.keyCode == 13) {
            e.preventDefault();
        }
    }

    const handleTitleChange = (e) => {
        let input = e.target;

        input.style.height = 'auto';
        input.style.height = input.scrollHeight + "px";

        setBook({ ...book, title: input.value })
    }

    useEffect(() => {
        if (!textEditor.isReady) {
            setTextEditor(new EditorJS({
                holderId: "textEditor",
                data: Array.isArray(content) ? content[0] : content,
                tools: tools,
                placeholder: "Let's write an awesome story for this book!"
            }))
        }
    }, [])


    const handlePublishEvent = () => {
        if (!title.length) {
            return toast.error("Write book name to publish it")
        }

        if (textEditor.isReady) {
            textEditor.save().then(data => {
                setBook({ ...book, content: data });
                setEditorState("publish")
            }).catch((err) => {
                console.log(err);
            })
        }
    }

    return (
        <>

            <Toaster />

            <nav className='navbar'>
                <Link to='/' className="w-10 flex-none">
                    <img src={logo} alt="" className='w-full' />
                </Link>

                <p className='max-md:hidden text-black line-clamp-1 w-full'>
                    {title.length ? title : "New"}
                </p>

                <div className='flex gap-4 ml-auto'>
                    <button
                        onClick={handlePublishEvent}
                        className='btn-dark py-2'>
                        Publish
                    </button>
                </div>
            </nav>

            <AnimationWrapper>
                <section>
                    <div className='mx-auto max-w-[900px] w-full'>
                        <textarea
                            defaultValue={title}
                            placeholder='Book Name'
                            className='text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40'
                            onKeyDown={handleTitleKeyDown}
                            onChange={handleTitleChange}
                        ></textarea>

                        <hr className='w-full opacity-10 my-5' />

                        <div id='textEditor' className='font-gelasio'></div>
                    </div>
                </section>
            </AnimationWrapper>
        </>
    );
};

export default BookEditor;