import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.tsx";
import { WardrobeProvider } from "./context/WardrobeContext.tsx";
import { StripeProvider } from "./context/StripeContext.tsx";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Navbar } from "./components/Navbar.tsx";

import { Home } from "./pages/HomePage.tsx";
import { Profile } from "./pages/ProfilePage.tsx";
import { SignUp } from "./pages/auth/SignUpPage.tsx";
import { EmailSignUp } from "./pages/auth/EmailSignUpPage.tsx";
import { SignIn } from "./pages/auth/SignInPage.tsx";
import { EmailSignIn } from "./pages/auth/EmailSignInPage.tsx";
import { StylistPage } from "./pages/StylistPage.tsx";
import { WardrobePage } from "./pages/WardrobePage.tsx";
import { ContactPage } from "./pages/ContactPage.tsx";
import { NotFoundPage } from "./pages/404.tsx";
import { CheckoutPage } from "./pages/subscription/CheckoutPage.tsx";
import { PaymentSuccessPageWrapper } from "./pages/subscription/PaymentSuccessPageWrapper.tsx";

import AuthGuard from "./guards/AuthGuard.tsx";
import GuestGuard from "./guards/GuestGuard.tsx";

function App() {
    return (
        <div className="app">
            <WardrobeProvider>
                <AuthProvider>
                    <StripeProvider>
                        <Navbar />
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route element={<GuestGuard />}>
                                <Route path="/profile" element={<Profile />} />
                            </Route>
                            <Route path="/checkout" element={<CheckoutPage />} />
                            <Route path="/payment-success" element={<PaymentSuccessPageWrapper />} />
                            <Route path="/stylist" element={<StylistPage />} />
                            <Route path="/wardrobe" element={<WardrobePage />} />
                            <Route path="/contact" element={<ContactPage />} />
                            <Route element={<AuthGuard />}>
                                <Route path="/sign-up" element={<SignUp />} />
                                <Route path="/sign-up/email" element={<EmailSignUp />} />
                                <Route path="/sign-in" element={<SignIn />} />
                                <Route path="/sign-in/email" element={<EmailSignIn />} />
                            </Route>
                            <Route path="*" element={<NotFoundPage />} />
                        </Routes>
                        <ToastContainer />
                    </StripeProvider>
                </AuthProvider>
            </WardrobeProvider>
        </div>
    );
}

export default App;