import { useState } from "react"

const InputBox = ({ type, name, placeholder, value, id, icon }) => {

    const [passwordVisible, setPasswordVisible] = useState(false);

    return (
        <div className="relative w-[100%] mb-4">
            <input
                type={type == "password" ? passwordVisible ? "text" : "password" : type}
                name={name}
                placeholder={placeholder}
                defaultValue={value}
                id={id}
                className="input-box"
            />

            <i className={"fi " + icon + " input-icon"}></i>

            {
                type == "password" ?
                    <i
                        onClick={() => setPasswordVisible(currenVal => !currenVal)}
                        className={"fi " + (passwordVisible ? "fi-rr-eye" : "fi-rr-eye-crossed") + " input-icon left-[auto] right-4 cursor-pointer"}
                    ></i> :
                    ""
            }
        </div>
    );
};

export default InputBox;