import { AuthContext } from "../../context/AuthContext.tsx";
import { useContext } from "react";
import { useSubscription } from "../../hooks/useSubscription.ts";
import { SubscriptionPlans } from "../../components/subscription/SubscriptionPlans.tsx";

export const SubscriptionManagePage = () => {
    const { user } = useContext(AuthContext);
    const {
        subscriptionStatus,
        periodEndDate,
        subscriptionId,
        cancelAtPeriodEnd,
        planAmount,
        planInterval,
        priceId
    } = useSubscription();

    const apiUrl = import.meta.env.VITE_BACKEND_URL;

    if (!user) return;


    const handleCancelResume = async () => {
        const token = await user.getIdToken();

        let endpoint;
        if (cancelAtPeriodEnd) {
            endpoint = '/user/resume'
        } else {
            endpoint = '/user/cancel'
        }

        await fetch(apiUrl + '/api/subscribe' + endpoint, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ userId: user.uid, subscriptionId })
        });
    };

    if (subscriptionStatus !== 'active') {
        return (
            <section className="flex items-center justify-center h-[80vh]">
                <SubscriptionPlans />
            </section>
        );
    }

    return (
        <section
            id="subscription-management"
            className="flex items-center justify-center h-[90vh]">
            <div
                className="max-md:w-11/12 md:w-1/2 h-[80vh] py-8 px-4 border-2 border-primary rounded-2xl
                shadow-lg shadow-primary/30 flex items-start justify-center">
                <div className="flex flex-col justify-center gap-2 text-center">
                    <p>
                        Subscription Status:
                        <span className="text-green-400 text-bold uppercase">
                            &nbsp;{subscriptionStatus}
                        </span>
                    </p>
                    {cancelAtPeriodEnd ? (
                        <p>
                            Ends at: {periodEndDate}
                        </p>
                    ) : (
                        <p>
                            Renews at: {periodEndDate}
                        </p>
                    )}
                    {subscriptionStatus === 'active' && !cancelAtPeriodEnd ? (
                        <button
                            onClick={handleCancelResume}
                            className="border border-primary rounded-xl px-2 py-1
                            shadow shadow-primary/60
                            transition-all duration-400 hover:brightness-125 active:bg-primary/10 active:brightness-90">
                            <span className="font-light">
                                Cancel subscription
                            </span>
                        </button>
                    ) : subscriptionStatus === 'active' && cancelAtPeriodEnd && (
                        <button
                            onClick={handleCancelResume}
                            className="border border-primary rounded-xl px-2 py-1
                            shadow shadow-primary/60
                            transition-all duration-400 hover:brightness-125 active:bg-primary/10 active:brightness-90">
                            <span className="font-light">
                                Resume subscription
                            </span>
                        </button>
                    )}
                    <div className="mt-4">
                        <h3 className="font-bold text-lg uppercase">Current plan</h3>
                        <h4 className="font-semibold border-b border-t my-2">{planAmount}$ / {planInterval}</h4>
                        {priceId === import.meta.env.VITE_STRIPE_PRICE_ID_BASIC ? (
                            <div>
                                <p><span className="uppercase font-semibold">Expanded</span> wardrobe space</p>
                                <p><span className="uppercase font-semibold">Weekly</span> outfit recommendations</p>
                                <p><span className="uppercase font-semibold">Weekly</span> outfit scheduling</p>
                            </div>
                        ) : (
                            <div className="lowercase leading-relaxed">
                                <p><span className="uppercase font-semibold">Unlimited</span> wardrobe space</p>
                                <p><span className="uppercase font-semibold">Unlimited</span> outfit recommendations</p>
                                <p><span className="uppercase font-semibold">Unlimited</span> outfit scheduling</p>
                            </div>
                        )}
                    </div>
                    <div className="mt-2">
                        <button
                            className="border border-primary rounded-xl px-6 py-1
                            shadow shadow-primary/60
                            transition-all duration-400 hover:brightness-125 active:bg-primary/10 active:brightness-90">
                            <span className="font-light">
                                Manage payments
                            </span>
                        </button>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg uppercase my-2">
                            Usage
                        </h3>
                        {/* TODO: Implement usage tracking via tracked values in firebase */}
                    </div>
                </div>
            </div>
        </section>
    )
}