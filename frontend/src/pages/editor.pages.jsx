import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../App';
import { Navigate, useParams } from 'react-router-dom';
import BookEditor from '../components/book-editor.component';
import PublishForm from '../components/publish-form.component';
import { createContext } from 'react';
import Loader from '../components/loader.component';
import axios from 'axios';

const bookStructure = {
    title: '',
    banner: '',
    content: [],
    tags: [],
    des: '',
    serial: '',
    writer: '',
    type: '',
    photo: '',
    author: { personal_info: {} }
}

export const EditorContext = createContext({});

const Editor = () => {

    let { book_id } = useParams();

    const [book, setBook] = useState(bookStructure);
    const [editorState, setEditorState] = useState("editor")
    const [textEditor, setTextEditor] = useState({ isReady: false })
    let [loading, setLoading] = useState(true)

    const { userAuth: { access_token } } = useContext(UserContext);

    useEffect(() => {
        if (!book_id) {
            return setLoading(false);
        }

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-book", { book_id, draft: true })
            .then(({ data: { book } }) => {
                setBook(book)
                setLoading(false)
            })

            .catch(err => {
                setBook(null);
                setLoading(false)
            })
    }, []);

    return (
        <EditorContext.Provider value={{ book, setBook, editorState, setEditorState, textEditor, setTextEditor }}>
            {
                access_token === null ? <Navigate to="/signin" /> :
                    loading ? <Loader /> :
                        editorState == "editor" ? <BookEditor /> : <PublishForm />
            }
        </EditorContext.Provider>
    );
};

export default Editor;