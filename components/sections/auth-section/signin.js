import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import LoginLogo from "../../../assets/LoginLogo.svg";
import googleIcon from "../../../assets/googleIcon.svg";
import fbIcon from "../../../assets/fbIcon.svg";
import Box from "@mui/material/Box";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import InputAdornment from "@mui/material/InputAdornment";
import { CustomTextField } from "../../core/CustomMUIComponents";
import { useForm } from "react-hook-form";
import { Alert } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { AuthTypeModal } from "../../core/Enum";
import CircularProgress from "@mui/material/CircularProgress";
import { SIGNIN_MUTATION } from "../../../graphql/mutations";
import { useMutation } from "@apollo/client";
import { toast } from "react-toastify";

export default function SignIn({ changeAuthModalType, handleClose }) {
  const [asVendor, setAsVendor] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
    getValues,
  } = useForm();
  const [signIn] = useMutation(SIGNIN_MUTATION);

  const onSubmit = (data) => {
    console.log("data", data);

    setLoading(true);
    signIn({
      variables: {
        username: data.username,
        password: data.password,
        type: asVendor ? "vendor" : "customer",
      },
    }).then(
      (res) => {
        console.log(res.data.signIn);
        toast.success(res.data.signIn.message, { theme: "colored" });
        localStorage.setItem("token", res.data.signIn.token);
        handleClose();
      },
      (error) => {
        console.log("error::", error.message);
        setLoading(false);
        toast.error(error.message, { theme: "colored" });
      }
    );
  };

  const onError = (errors) => console.log("Errors Occurred !! :", errors);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 h-full">
        <div className="p-4 hidden sm:block h-full">
          <div className="auth-cover !bg-cover w-full h-full text-center">
            {/* <Image src={LoginLogo} alt="CoverImage" /> */}
          </div>
        </div>
        <div className="p-4 mt-3 sm:mt-0 ml-0 sm:ml-4 md:ml-4 lg:ml-12 ">
          <div className="flex">
            <CloseIcon
              className="text-black ml-auto cursor-pointer"
              onClick={handleClose}
            />
          </div>
          <h3 className="pb-2 mt-3 sm:mt-16 font-semibold text-xl sm:text-2xl text-colorPrimary flex justify-center sm:block">
            {asVendor ? "Login As a Vendor!" : "Login to your account!"}
          </h3>

          <div className="mt-4 sm:mt-5">
            <form onSubmit={handleSubmit(onSubmit, onError)} onReset={reset}>
              <div className="flex flex-col">
                <div className="flex sm:block justify-center">
                  <div className="flex sm:block flex-col mb-6 w-[90%] md:w-5/6 lg:w-3/4">
                    <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                      <EmailIcon
                        sx={{ mr: 2, my: 0.5 }}
                        className="text-black"
                      />
                      <CustomTextField
                        id="input-with-sx"
                        label={
                          asVendor
                            ? "Email Address or Contact Number"
                            : "Contact Number"
                        }
                        variant="standard"
                        className="w-full"
                        {...register("username", {
                          required: "Username is required",
                        })}
                      />
                    </Box>
                    <div className="mt-2 ml-9">
                      {errors.username && (
                        <span style={{ color: "red" }} className="-mb-6">
                          {errors.username?.message}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex sm:block justify-center">
                  <div className="flex sm:block flex-col mb-1 sm:mb-3 w-[90%] md:w-5/6 lg:w-3/4">
                    <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                      <LockIcon
                        sx={{ mr: 2, my: 0.5 }}
                        className="text-black"
                      />
                      <CustomTextField
                        type={showPassword ? "text" : "password"}
                        id="input-with-sx"
                        label="Password"
                        variant="standard"
                        className="w-full"
                        {...register("password", {
                          required: "Password is required",
                        })}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment
                              position="start"
                              className="cursor-pointer"
                              onClick={() => setShowPassword((show) => !show)}
                            >
                              {!showPassword ? (
                                <VisibilityOffIcon />
                              ) : (
                                <RemoveRedEyeIcon />
                              )}
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>
                    <div className="mt-2 ml-9">
                      {errors.password && (
                        <span style={{ color: "red" }} className="-mb-6">
                          {errors.password?.message}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-center sm:block">
                  <div className="flex justify-end mb-6 sm:mb-8 w-[90%] md:w-5/6 lg:w-3/4">
                    <Link href="/auth/forgot-password">
                      <span className="text-[#544E5D] ml-auto opacity-50 cursor-pointer">
                        Forgot Password?
                      </span>
                    </Link>
                  </div>
                </div>

                <div className="flex justify-center sm:block">
                  <button
                    type="submit"
                    className="bg-colorPrimary hover:bg-colorPrimary text-gray-100 p-4 w-[90%] md:w-5/6 lg:w-3/4 rounded-xl tracking-wide
                  font-semibold font-display focus:outline-none focus:shadow-outline 
                  shadow-lg flex items-center justify-center"
                  >
                    {loading && (
                      <CircularProgress
                        size={20}
                        color="primary"
                        sx={{ color: "white", mr: 1 }}
                      />
                    )}
                    Login to Continue
                  </button>
                </div>
              </div>
            </form>
            <div className="flex justify-center sm:block">
              <div className="mt-6 sm:mt-12 gap-6 justify-between items-center flex-row  w-[90%] md:w-5/6 lg:w-3/4 block xl:flex">
                <button className="pt-3 pb-3 social-icon pr-2 pl-2  w-full focus:ring-0 focus:outline-none font-medium rounded-xl text-sm text-center inline-flex items-center justify-center border">
                  <div className="flex justify-center items-center mr-3">
                    <Image
                      src={googleIcon}
                      alt="back"
                      width={20}
                      height={20}
                      layout="fixed"
                    />
                  </div>
                  <span className="text-black whitespace-nowrap">
                    Login with Google
                  </span>
                </button>

                <button className="pt-3 pb-3 pr-2 pl-2  social-icon w-full focus:ring-0 focus:outline-none font-medium rounded-xl text-sm text-center inline-flex items-center justify-center border mt-4 xl:mt-0">
                  <div className="flex justify-center items-center mr-3">
                    <Image
                      src={fbIcon}
                      alt="back"
                      width={20}
                      height={20}
                      layout="fixed"
                    />
                  </div>
                  <span className="text-black whitespace-nowrap">
                    Login with Facebook
                  </span>
                </button>
              </div>
            </div>
            <div className="flex justify-center sm:justify-between items-center mb-6 w-full md:w-5/6 lg:w-3/4 mt-6 sm:mt-8 text-center">
              <div className="ml-0 sm:ml-auto">
                <span className="text-black">{`Don't`} have an account ?</span>
                <span
                  className="cursor-pointer text-colorPrimary ml-1 font-bold"
                  onClick={() => changeAuthModalType(AuthTypeModal.Signup)}
                >
                  Sign up
                </span>
              </div>
            </div>

            <div className="border-2 border-dashed rounded py-2 px-1 flex justify-center items-center mb-6 w-full md:w-5/6 lg:w-3/4 mt-4 sm:mt-5 text-center">
              <span className="text-black">
                {asVendor ? "Are you a customer ?" : "Are you a vendor ?"}
              </span>
              <button
                className="cursor-pointer text-colorWhite bg-colorPrimary py-2 px-3 rounded ml-2"
                onClick={(e) => setAsVendor(!asVendor)}
              >
                {asVendor ? "Customer" : "Business"} Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
