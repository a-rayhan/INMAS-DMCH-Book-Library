import { Link } from "react-router-dom";
import pageNotFoundImg from "../imgs/404.png";
import fullLogo from "../imgs/logo.png";



const PageNotFound = () => {
    return (
        <section className="h-cover relative p-10 flex flex-col justify-center items-center gap-20 text-center">
            <img src={pageNotFoundImg} alt="" className="select-none border-2 border-grey w-72 aspect-square object-cover rounded" />

            <h1 className="text-4xl font-gelasio leading-7">
                Page not found
            </h1>

            <p className="text-dark-grey text-xl leading-7">
                This page you are looking for dows not exists. Head back to the <Link to="/" className="text-black underline">home page</Link>
            </p>

            <Link to='/' className="flex items-center gap-3">
                <img src={fullLogo} alt="" className='w-14' />

                <span className='text-xl leading-5'>
                    <span className='hidden lg:block'>Institute Of Nuclear  Medicine  & <br /> Allied Sciences (INMAS) ~ DMCH</span>
                    <span className='lg:hidden'>INMAS ~ <br /> DMCH</span>
                </span>

            </Link>
        </section>
    );
};

export default PageNotFound;