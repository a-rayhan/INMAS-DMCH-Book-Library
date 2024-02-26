import { Link, Outlet, useNavigate } from 'react-router-dom';
import logo from '../imgs/logo.png';
import { useContext, useState } from 'react';
import { UserContext } from '../App';
import UserNavigationPanel from './user-navigation.component';
import Footer from './footer.component';

const Navbar = () => {

    const [searchBoxVisibility, setSearchBoxVisibility] = useState(false)
    const [userNavigationPanel, setUserNavigationPanel] = useState(false)

    let navigate = useNavigate();

    const { userAuth } = useContext(UserContext);

    const { access_token } = userAuth;

    const handleUserNavPanel = () => {
        setUserNavigationPanel(currenVal => !currenVal)
    }

    const handleOnBlur = () => {
        setTimeout(() => {
            setUserNavigationPanel(false)
        }, 200)
    }

    const handleSearch = (e) => {
        let query = e.target.value;

        if (e.keyCode == 13 && query.length) {
            navigate(`/search/${query}`)
        }
    }

    return (
        <>
            <nav className="navbar">
                <Link to='/' className="flex items-center gap-3">
                    <img src={logo} alt="" className='w-14' />

                    <span className='text-xl leading-5'>
                        <span className='hidden lg:block'>Institute Of Nuclear  Medicine  & <br /> Allied Sciences (INMAS) ~ DMCH</span>
                        <span className='lg:hidden'>INMAS ~ <br /> DMCH</span>
                    </span>

                </Link>

                <div className='flex items-center gap-3 md:gap-6 ml-auto'>
                    {
                        access_token &&
                        <>
                            <div className={"absolute bg-white w-full left-0 top-full mt-0.5 border-b border-grey py-4 px-[5vw] md:border-0 md:block md:relative md:inset-0 md:p-0 md:w-auto md:show " + (searchBoxVisibility ? "show" : "hide")}>
                                <input
                                    type="text"
                                    placeholder='Search'
                                    className='w-full md:w-auto bg-grey p-4 pl-6 pr-[12%] md:pr-6 rounded-full placeholder:text-dark-grey md:pl-12'
                                    onKeyDown={handleSearch}
                                />

                                <i className="fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey"></i>
                            </div>

                            <button
                                onClick={() => setSearchBoxVisibility(currenVal => !currenVal)}
                                className='md:hidden bg-grey w-12 h-12 rounded-full flex items-center justify-center'
                            >
                                <i className="fi fi-rr-search text-xl"></i>
                            </button>

                            <div
                                onClick={handleUserNavPanel}
                                onBlur={handleOnBlur}
                                className='relative'
                            >
                                <button className='w-12 h-12 mt-1'>
                                    <i className="fi fi-rr-apps text-2xl"></i>
                                </button>

                                <div>
                                    {
                                        userNavigationPanel ?
                                            <UserNavigationPanel /> : ""
                                    }
                                </div>
                            </div>
                        </>
                    }

                </div>

            </nav>

            <Outlet />

            <Footer />
        </>
    );
};

export default Navbar;