import { toast } from "react-toastify";

export const ContactPage = () => {
    return (
        <section id="contact" className="bg-secondary text-primary font-Josefin py-16">
            <div className="container mx-auto px-4">
                {/* Page Header */}
                <h2 className="text-4xl font-bold text-left mb-4">Contact Us</h2>
                <p className="text-lg text-left mb-8">
                    Have a question, feedback, or need assistance? We'd love to hear from you!
                </p>

                {/* Contact Form & Details */}
                <div className="grid md:grid-cols-2 gap-8 items-start">
                    {/* Contact Form */}
                    <form
                        className="bg-primary text-secondary text-primary p-6 rounded-xl w-full"
                        onSubmit={(e) => {
                            e.preventDefault();
                            toast.success("Form submitted successfully!", {
                                position: "top-center",
                                closeOnClick: true,
                                theme: "dark",
                            })
                        }}
                    >
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-lg font-medium mb-2">
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                placeholder="Your Name"
                                required
                                className="w-full border border-primary rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-lg font-medium mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Your Email"
                                required
                                className="w-full border border-primary rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="message" className="block text-lg font-medium mb-2">
                                Message
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                rows={5}
                                placeholder="Your Message"
                                required
                                className="w-full border border-primary rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-secondary text-primary font-bold py-2 px-4 rounded-xl hover:bg-opacity-90 transition"
                        >
                            Send Message
                        </button>
                    </form>

                    {/* Contact Details */}
                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        <h3 className="text-3xl font-semibold mb-4">Get in Touch</h3>
                        <p className="text-lg mb-6">
                            You can also reach us directly through the following:
                        </p>
                        <div className="space-y-4">
                            <p>
                                <strong>Email:</strong>{" "}
                                <a
                                    href="mailto:support@indumenta.com"
                                    className="hover:underline"
                                >
                                    support@indumenta.com
                                </a>
                            </p>
                            <p>
                                <strong>Phone:</strong>{" "}
                                <a href="tel:+1234567890" className="hover:underline">
                                    +1 (234) 567-890
                                </a>
                            </p>
                            <p>
                                <strong>Address:</strong> <br />
                                123 Fashion Avenue, Style City, USA
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
