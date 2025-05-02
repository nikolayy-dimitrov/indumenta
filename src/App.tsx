import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.tsx";
import { WardrobeProvider } from "./context/WardrobeContext.tsx";
import { StripeProvider } from "./context/StripeContext.tsx";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { MainLayout } from "./layouts/MainLayout.tsx";
import { AuthLayout } from "./layouts/AuthLayout.tsx";

import { Home } from "./pages/HomePage.tsx";
import { Profile } from "./pages/ProfilePage.tsx";
import { AuthPage } from "./pages/auth/AuthPage.tsx";
import { ForgotPasswordPage } from "./pages/auth/ForgotPasswordPage.tsx";
import { ResetPasswordPage } from "./pages/auth/ResetPasswordPage.tsx";
import { StylistPage } from "./pages/StylistPage.tsx";
import { WardrobePage } from "./pages/WardrobePage.tsx";
import { ContactPage } from "./pages/ContactPage.tsx";
import { NotFoundPage } from "./pages/404.tsx";
import { CheckoutPage } from "./pages/subscription/CheckoutPage.tsx";
import { PaymentSuccessPageWrapper } from "./pages/subscription/PaymentSuccessPageWrapper.tsx";
import { SubscriptionManagePage } from "./pages/subscription/SubscriptionManagePage.tsx";
import { OutfitCalendar } from "./pages/OutfitCalendarPage.tsx";

import AuthGuard from "./guards/AuthGuard.tsx";
import GuestGuard from "./guards/GuestGuard.tsx";

function App() {
    return (
        <div className="app">
            <WardrobeProvider>
                <AuthProvider>
                    <StripeProvider>
                        <Routes>
                            {/* Auth routes without navbar */}
                            <Route element={<AuthLayout />}>
                                <Route element={<AuthGuard />}>
                                    <Route path="/authentication" element={<AuthPage />} />
                                    <Route path="/authentication/forgot-password" element={<ForgotPasswordPage />} />
                                    <Route path="/authentication/reset-password" element={<ResetPasswordPage />} />
                                    <Route path="/__/auth/action" element={<ResetPasswordPage />} />
                                </Route>
                            </Route>

                            {/* Main routes with navbar */}
                            <Route element={<MainLayout />}>
                                <Route path="/" element={<Home />} />
                                <Route element={<GuestGuard />}>
                                    <Route path="/profile" element={<Profile />} />
                                    <Route path="/profile/calendar" element={<OutfitCalendar />} />
                                    <Route path="/subscription/manage" element={<SubscriptionManagePage />} />
                                </Route>
                                <Route path="/checkout" element={<CheckoutPage />} />
                                <Route path="/payment-success" element={<PaymentSuccessPageWrapper />} />
                                <Route path="/stylist" element={<StylistPage />} />
                                <Route path="/wardrobe" element={<WardrobePage />} />
                                <Route path="/contact" element={<ContactPage />} />
                                <Route path="*" element={<NotFoundPage />} />
                            </Route>
                        </Routes>
                        <ToastContainer />
                    </StripeProvider>
                </AuthProvider>
            </WardrobeProvider>
        </div>
    );
}

export default App;