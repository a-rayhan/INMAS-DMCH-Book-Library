import { Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar.component";
import UserAuthForm from "./pages/userAuthForm.page";
import { createContext, useEffect, useState } from "react";
import { lookInSession } from "./common/session";
import Editor from "./pages/editor.pages";
import HomePage from "./pages/home.page";
import SearchPage from "./pages/search.page";
import PageNotFound from "./pages/404.page";
import BookPage from "./pages/book.page";

export const UserContext = createContext({})

const App = () => {

    const [userAuth, setUserAuth] = useState({});

    useEffect(() => {
        let userInSession = lookInSession("user");

        userInSession ? setUserAuth(JSON.parse(userInSession)) : setUserAuth({ access_token: null })
    }, [])

    return (
        <UserContext.Provider value={{ userAuth, setUserAuth }}>
            <Routes>
                <Route path="/" element={<Navbar />}>
                    <Route index element={<HomePage />} />
                    <Route path="/signin" element={<UserAuthForm type="sign-in" />} />
                    <Route path="/signup" element={<UserAuthForm type="sign-up" />} />
                    <Route path="/search/:query" element={<SearchPage />} />
                    <Route path="/book/:book_id" element={<BookPage />} />
                </Route>

                <Route path="/editor" element={<Editor />} />
                <Route path="/editor/:book_id" element={<Editor />} />
                <Route path="*" element={<PageNotFound />} />
            </Routes>
        </UserContext.Provider>
    )
}

export default App;