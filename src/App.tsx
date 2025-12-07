import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import { LoadingIndicator } from "./components/UI/LoadingIndicator";

import { AuthProvider } from "./context/AuthContext.tsx";
import { WardrobeProvider } from "./context/WardrobeContext.tsx";
import { StripeProvider } from "./context/StripeContext.tsx";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { MainLayout } from "./layouts/MainLayout.tsx";
import { AuthLayout } from "./layouts/AuthLayout.tsx";

import AuthGuard from "./guards/AuthGuard.tsx";
import GuestGuard from "./guards/GuestGuard.tsx";

const Home = lazy(() => import("./pages/HomePage.tsx").then(m => ({ default: m.Home })));
const Profile = lazy(() => import("./pages/ProfilePage.tsx").then(m => ({ default: m.Profile })));
const AuthPage = lazy(() => import("./pages/auth/AuthPage.tsx").then(m => ({ default: m.AuthPage })));
const ForgotPasswordPage = lazy(() => import("./pages/auth/ForgotPasswordPage.tsx").then(m => ({ default: m.ForgotPasswordPage })));
const ResetPasswordPage = lazy(() => import("./pages/auth/ResetPasswordPage.tsx").then(m => ({ default: m.ResetPasswordPage })));
const StylistPage = lazy(() => import("./pages/StylistPage.tsx").then(m => ({ default: m.StylistPage })));
const WardrobePage = lazy(() => import("./pages/WardrobePage.tsx").then(m => ({ default: m.WardrobePage })));
const ShowroomPage = lazy(() => import("./pages/ShowroomPage.tsx").then(m => ({ default: m.ShowroomPage })));
const ContactPage = lazy(() => import("./pages/ContactPage.tsx").then(m => ({ default: m.ContactPage })));
const NotFoundPage = lazy(() => import("./pages/404.tsx").then(m => ({ default: m.NotFoundPage })));
const CheckoutPage = lazy(() => import("./pages/subscription/CheckoutPage.tsx").then(m => ({ default: m.CheckoutPage })));
const PaymentSuccessPageWrapper = lazy(() => import("./pages/subscription/PaymentSuccessPageWrapper.tsx").then(m => ({ default: m.PaymentSuccessPageWrapper })));
const SubscriptionManagePage = lazy(() => import("./pages/subscription/SubscriptionManagePage.tsx").then(m => ({ default: m.SubscriptionManagePage })));
const OutfitCalendar = lazy(() => import("./pages/OutfitCalendarPage.tsx").then(m => ({ default: m.OutfitCalendar })));

function App() {
    return (
        <div className="app">
            <WardrobeProvider>
                <AuthProvider>
                    <StripeProvider>
                        <Suspense fallback={<LoadingIndicator/>}>
                            <Routes>
                                {/* Auth routes without navbar */}
                                <Route element={<AuthLayout/>}>
                                    <Route element={<AuthGuard/>}>
                                        <Route path="/authentication" element={<AuthPage/>}/>
                                        <Route path="/authentication/forgot-password"
                                               element={<ForgotPasswordPage/>}/>
                                        <Route path="/authentication/reset-password"
                                               element={<ResetPasswordPage/>}/>
                                        <Route path="/__/auth/action"
                                               element={<ResetPasswordPage/>}/>
                                    </Route>
                                </Route>

                                {/* Main routes with navbar */}
                                <Route element={<MainLayout/>}>
                                    <Route path="/" element={<Home/>}/>
                                    <Route element={<GuestGuard/>}>
                                        <Route path="/profile" element={<Profile/>}/>
                                        <Route path="/profile/calendar"
                                               element={<OutfitCalendar/>}/>
                                        <Route path="/subscription/manage"
                                               element={<SubscriptionManagePage/>}/>
                                    </Route>
                                    <Route path="/checkout" element={<CheckoutPage/>}/>
                                    <Route path="/payment-success"
                                           element={<PaymentSuccessPageWrapper/>}/>
                                    <Route path="/stylist" element={<StylistPage/>}/>
                                    <Route path="/wardrobe" element={<WardrobePage/>}/>
                                    <Route path="/showroom" element={<ShowroomPage/>}/>
                                    <Route path="/contact" element={<ContactPage/>}/>
                                    <Route path="*" element={<NotFoundPage/>}/>
                                </Route>
                            </Routes>
                        </Suspense>
                        <ToastContainer/>
                    </StripeProvider>
                </AuthProvider>
            </WardrobeProvider>
        </div>
    );
}

export default App;