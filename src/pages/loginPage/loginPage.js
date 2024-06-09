/* eslint-disable no-unused-vars */
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../../config/config";
import { message, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { jwtDecode } from "jwt-decode";

let currentEmail = "";
let currentPassword = "";

export default function LoginPage() {
    const navigate = useNavigate();
    const [loginError, setLoginError] = useState(false);
    const [enterOTP, setOTP] = useState(false);
    const [isSendingOTP, setSendingOTP] = useState(false);

    const [isLoggingIn, setIsLoggingIn] = useState(false);
    async function login() {
        setIsLoggingIn(true);
        let email = document.getElementById("email").value;
        let password = document.getElementById("password").value;
        currentEmail = email;
        currentPassword = password;

        try {
            let response = await axios.post(`${API_BASE}/auth/login`, {
                email: email.toString().trim(),
                password: password.toString().trim(),
            });

            if (response.status === 200 || response.status === 201) {
                setIsLoggingIn(false);
                let token = response.data["token"];
                console.log(token);
                let decoded = jwtDecode(token);
                localStorage.setItem("token", token);

                if (decoded["role"] === "Admin") {
                    setLoginError(false);
                    navigate("/adminDashboard");
                } else if (decoded["role"] === "User") {
                    setLoginError(false);
                    navigate("/dashboard");
                } else {
                    // TODO REMOVE THIS
                    setLoginError(true);
                    message.error("Incorrect Username or Password.");
                }
            } else {
                setLoginError(true);
                message.error("Incorrect Username or Password.");
                setIsLoggingIn(false);
            }
        } catch (e) {
            setIsLoggingIn(false);
            message.error("Incorrect Username or Password.");
        }
    }

    const [isSigningIn, setIsSigningIn] = useState(false);
    async function signUp() {
        setIsSigningIn(true);
        let email = document.getElementById("email").value;
        let password = document.getElementById("password").value;
        currentEmail = email;
        currentPassword = password;

        try {
            let response = await axios.post(`${API_BASE}/auth/register`, {
                email: email.toString().trim(),
                password: password.toString().trim(),
            });

            console.log(response.status);
            setSendingOTP(true);

            if (response.status === 200 || response.status === 201) {
            }
            //     let token = response.data["token"];
            //     let decoded = jwtDecode(token);
            //     localStorage.setItem("token", token);

            //     if (decoded["role"] === "Admin") {
            //         setLoginError(false);
            //         navigate("/adminDashboard");
            //     } else if (decoded["role"] === "User") {
            //         setLoginError(false);
            //         navigate("/dashboard");
            //     } else {
            //         // TODO REMOVE THIS
            //         setLoginError(true);
            //         message.error("Incorrect Username or Password.");
            //     }
            // }
        } catch (e) {}
        setIsSigningIn(false);
    }

    const [isConfirmingOTP, setConfirmingOTP] = useState(false);
    async function confirmOTP() {
        setConfirmingOTP(true);

        let otp = document.getElementById("otp").value;
        let response = await axios.post(`${API_BASE}/auth/verify-otp`, {
            email: currentEmail.toString().trim(),
            otp: otp.toString().trim(),
        });

        if (response.status === 200 || response.status === 201) {
            // LOGIN WHEN OTP CONFIRMS
            let response = await axios.post(`${API_BASE}/auth/login`, {
                email: currentEmail.toString().trim(),
                password: currentPassword.toString().trim(),
            });

            let token = response.data["token"];
            let decoded = jwtDecode(token);
            localStorage.setItem("token", token);
            console.log(token);

            if (decoded["role"] === "Admin") {
                setLoginError(false);
                navigate("/adminDashboard");
            } else if (decoded["role"] === "User") {
                setLoginError(false);
                navigate("/dashboard");
            } else {
                // TODO REMOVE THIS
                setLoginError(true);
                message.error("Incorrect Username or Password.");
            }
        }
    }

    const [hidePassword, hideUnhidePassword] = useState(true);
    function hideUnhidePasswordFunc() {
        hideUnhidePassword(!hidePassword);
    }

    const [isSigningUp, setSignUp] = useState(false);
    function switchBetweenSignUpSignIn() {
        document.getElementById("email").value = "";
        document.getElementById("password").value = "";
        setSignUp(!isSigningUp);
    }

    return (
        <div className="flex h-screen overflow-hidden text-black">
            <div className="w-7/12 h-screen bg-zinc-900 grid items-center">
                <img
                    src="./assets/b.png"
                    alt="logo"
                    className="m-auto w-full h-max border"
                />
                <img
                    src="./assets/a.png"
                    alt="logo"
                    className="m-auto w-full h-min border"
                />
                <img
                    src="./assets/c.png"
                    alt="logo"
                    className="m-auto w-full object-cover"
                />
            </div>
            <div className="w-1/2 h-screen flex items-center bg-white">
                <div className="w-1/2 grid p-10 mx-auto">
                    <img
                        src="./assets/airlines-logo.png"
                        alt="logo"
                        className="m-auto w-full p-5"
                    />
                    <div className="h-5"></div>

                    {isSendingOTP === false ? (
                        <>
                            <div className="flex flex-col">
                                {/* EMAIL */}
                                <label className="pb-2"> Email </label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="email..."
                                    className="border-2 rounded-lg px-3 py-1 bg-white outline-none"
                                />
                                <div className="h-4"></div>

                                {/* PASSWORD */}
                                <label className="pb-2"> Password </label>
                                <div className="flex">
                                    <input
                                        id="password"
                                        type={
                                            hidePassword === true
                                                ? "password"
                                                : "text"
                                        }
                                        placeholder="password..."
                                        className=" w-full border-2 rounded-lg px-3 py-1 bg-white outline-none"
                                    />
                                    <div className="h-2"></div>

                                    {hidePassword === true ? (
                                        <Eye
                                            size={25}
                                            className="pl-2 hover:text-blue-500 cursor-pointer"
                                            onClick={(e) =>
                                                hideUnhidePasswordFunc()
                                            }
                                        />
                                    ) : (
                                        <EyeOff
                                            size={25}
                                            className="pl-2 hover:text-blue-500 cursor-pointer"
                                            onClick={(e) =>
                                                hideUnhidePasswordFunc()
                                            }
                                        />
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-between pt-2 pb-8">
                                {loginError === true ? (
                                    <div className="text-red-500 pl-2 text-left">
                                        Incorrect Username or Password
                                    </div>
                                ) : (
                                    <div className="pb-6"> </div>
                                )}

                                <div className="text-right">
                                    <span className="hover:underline hover:underline-offset-4 pr-2 hover:text-blue-500 cursor-pointer">
                                        Forgot Password?
                                    </span>
                                </div>
                            </div>
                            {isSigningUp === false ? (
                                <div
                                    className={
                                        isLoggingIn === true
                                            ? "bg-green-500 rounded-lg py-2 text-center"
                                            : "bg-zinc-900 hover:bg-green-500 text-white hover:text-black text-center rounded-lg py-2 font-semibold cursor-pointer"
                                    }
                                    onClick={(e) =>
                                        isLoggingIn === true
                                            ? () => {}
                                            : login()
                                    }
                                >
                                    {isLoggingIn === true ? (
                                        <Spin
                                            indicator={
                                                <LoadingOutlined
                                                    style={{
                                                        fontSize: 18,
                                                        accentColor: "white",
                                                    }}
                                                    spin
                                                />
                                            }
                                        />
                                    ) : (
                                        "Sign In"
                                    )}
                                </div>
                            ) : isSigningIn === false ? (
                                <div
                                    className="bg-zinc-900 hover:bg-green-500 text-white hover:text-black text-center rounded-lg py-2 font-semibold cursor-pointer"
                                    onClick={(e) => signUp()}
                                >
                                    Sign Up
                                </div>
                            ) : (
                                <div className="bg-green-500 text-white text-center rounded-lg py-2">
                                    <Spin
                                        indicator={
                                            <LoadingOutlined
                                                style={{
                                                    fontSize: 18,
                                                    accentColor: "white",
                                                }}
                                                spin
                                            />
                                        }
                                    />
                                </div>
                            )}
                            {isSigningUp === false ? (
                                <div className="pt-2 mx-auto text-center">
                                    Don't have an account?{" "}
                                    <span
                                        className="hover:underline hover:underline-offset-4 text-blue-600 cursor-pointer"
                                        onClick={(e) =>
                                            switchBetweenSignUpSignIn()
                                        }
                                    >
                                        Sign Up
                                    </span>
                                </div>
                            ) : (
                                <div className="pt-2 mx-auto text-center">
                                    Already have an account?{" "}
                                    <span
                                        className="hover:underline hover:underline-offset-4 text-blue-600 cursor-pointer"
                                        onClick={(e) =>
                                            switchBetweenSignUpSignIn()
                                        }
                                    >
                                        Sign In
                                    </span>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex flex-col">
                            {/* OTP */}
                            <label className="pb-2"> OTP </label>
                            <input
                                id="otp"
                                type="otp"
                                placeholder="OTP..."
                                className="border-2 rounded-lg px-3 py-1 bg-white outline-none"
                            />
                            <div className="h-4"></div>
                            {isConfirmingOTP === true ? (
                                <div className="bg-green-500 text-white text-center rounded-lg py-2">
                                    <Spin
                                        indicator={
                                            <LoadingOutlined
                                                style={{
                                                    fontSize: 18,
                                                    accentColor: "white",
                                                }}
                                                spin
                                            />
                                        }
                                    />
                                </div>
                            ) : (
                                <div
                                    className="bg-zinc-900 hover:bg-green-500 text-white hover:text-black text-center rounded-lg py-2 font-semibold cursor-pointer"
                                    onClick={(e) => confirmOTP()}
                                >
                                    Confirm OTP
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
