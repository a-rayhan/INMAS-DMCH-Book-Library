import { Link } from "react-router-dom";
import AnimationWrapper from "../common/page-animation";
import { useContext } from "react";
import { UserContext } from "../App";
import { removeFromSession } from "../common/session";

const UserNavigationPanel = () => {

    const { userAuth: { username, access_token }, setUserAuth } = useContext(UserContext);

    const signOutUer = () => {
        removeFromSession("user");
        setUserAuth({ access_token: null })
    }

    return (
        <AnimationWrapper
            className="absolute right-0 z-50"
            transition={{ duration: 0.2 }}
        >
            <div className="bg-white absolute right-0 border border-grey w-60 duration-200">

                <Link to='/editor' className="flex gap-2 link pl-8 py-4">
                <i className="fi fi-rr-file-edit"></i>
                    <p>Add new</p>
                </Link>

                <button
                    onClick={signOutUer}
                    className="text-left p-4 hover:bg-grey w-full pl-8 py-4"
                >
                    <h1 className="font-bold text-xl mt-1">
                        Sign Out
                    </h1>

                    <p className="text-dark-grey">@{username}</p>
                </button>
            </div>
        </AnimationWrapper>
    );
};

export default UserNavigationPanel;