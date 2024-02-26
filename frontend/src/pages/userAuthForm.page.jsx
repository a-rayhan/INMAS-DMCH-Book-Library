import { Link, Navigate } from "react-router-dom";
import InputBox from "../components/input.component";
import AnimationWrapper from "../common/page-animation";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import { storeInSession } from "../common/session";
import { useContext } from "react";
import { UserContext } from "../App";

const UserAuthForm = ({ type }) => {

    let { userAuth: { access_token }, setUserAuth } = useContext(UserContext);

    const userAuthThroughServer = (serverRoute, formData) => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData)
            .then(({ data }) => {
                storeInSession("user", JSON.stringify(data));
                setUserAuth(data);
            })
            .catch(({ response }) => {
                toast.error(response.statusText)
            })
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        let serverRoute = type == "sign-in" ? "/signin" : "/signup";

        // regex for email
        let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        let form = new FormData(formElement);
        let formData = {};

        for (let [key, value] of form.entries()) {
            formData[key] = value;
        }

        let { fullname, email, password, secretcode } = formData;

        if (fullname) {
            if (fullname.length < 3) {
                return toast.error("Fullname must be at least 3 letters long")
            }
        }

        if (!email.length) {
            return toast.error("Enter email")
        }

        if (!password.length) {
            return toast.error("Write password")
        }

        if (!emailRegex.test(email)) {
            return toast.error("Email not valid")
        }

        if (!secretcode.length) {
            return toast.error("You must enter secret code")
        }

        if (secretcode !== "~inmasdmch") {
            return toast.error("Please enter correct secret code")
        }

        userAuthThroughServer(serverRoute, formData);

    }

    return (
        access_token ?
            <Navigate to="/" /> :
            <AnimationWrapper keyValue={type}>
                <section className="h-cover flex items-center justify-center">

                    <Toaster />

                    <form id="formElement" className="w-[80%] max-w-[400px]">
                        <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
                            {type == "sign-in" ? "Welcome back" : "Join us today"}
                        </h1>

                        {
                            type !== "sign-in" ?
                                <InputBox
                                    name='fullname'
                                    type="text"
                                    placeholder="Full Name"
                                    icon="fi-rr-user"
                                />
                                : ""
                        }

                        <InputBox
                            name='email'
                            type="email"
                            placeholder="Email"
                            icon="fi-rr-envelope"
                        />

                        <InputBox
                            name='password'
                            type="password"
                            placeholder="Password"
                            icon="fi-rr-key"
                        />

                        {
                            type == "sign-in" ?
                                <InputBox
                                    name='secretcode'
                                    type="text"
                                    placeholder="Secret code"
                                    icon="fi-rr-lock-alt"
                                />
                                : ""
                        }

                        {
                            type == "sign-in" ?
                                <p className="text-sm flex gap-2">
                                    <i class="fi fi-rr-info text-purple" />
                                    You must be collect login secret code from authority.
                                </p>
                                : ""
                        }

                        <button
                            className="btn-dark center mt-14"
                            type="submit"
                            onClick={handleSubmit}
                        >
                            {type.replace("-", " ")}
                        </button>

                        <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
                            <hr className="w-1/2 border-black" />
                            <p>or</p>
                            <hr className="w-1/2 border-black" />
                        </div>

                        {
                            type == "sign-in" ?
                                <p className="mt-6 text-dark-grey text-xl text-center">
                                    Don't have an account?
                                    <Link to="/signup" className="underline text-black ml-1 text-xl">
                                        Join us today
                                    </Link>
                                </p> :
                                <p className="mt-6 text-dark-grey text-xl text-center">
                                    Already a member?
                                    <Link to="/signin" className="underline text-black ml-1 text-xl">
                                        Sign in here.
                                    </Link>
                                </p>
                        }

                    </form>
                </section>
            </AnimationWrapper>
    );
};

export default UserAuthForm;