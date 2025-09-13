const Footer = () => {
    return (
        <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-x-hidden">
            <footer className="py-20 bg-black/20 backdrop-blur-sm border-t border-white/10">
                <div className="max-w-6xl mx-auto px-4 sm:px-8">
                    <div className="grid lg:grid-cols-4 gap-8 mb-12">
                        <div>
                            <h3 className="text-3xl font-extrabold mb-4 bg-gradient-to-r from-indigo-400 to-fuchsia-400 bg-clip-text text-transparent">
                                TheQuro
                            </h3>
                            <p className="text-gray-400 mb-4">
                                Your intelligent study companion powered by cutting-edge AI technology.
                            </p>
                        </div>

                        {[{
                            title: "Explore",
                            links: ["Features", "Pricing", "Integrations"]
                        }, {
                            title: "Company",
                            links: ["About", "Blog", "Careers", "Contact"]
                        }, {
                            title: "Support",
                            links: ["Help Center", "Community", "Status", "Privacy Policy"]
                        }].map((column, idx) => (
                            <div key={idx}>
                                <h4 className="font-semibold text-lg mb-4 text-white/90 tracking-wide">
                                    {column.title}
                                </h4>
                                <ul className="space-y-2">
                                    {column.links.map((link, linkIdx) => (
                                        <li key={linkIdx}>
                                            <a
                                                href="#"
                                                className="text-gray-400 hover:text-white transition-colors duration-200 ease-in-out"
                                            >
                                                {link}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-white/10 pt-8 text-center text-gray-500 text-sm">
                        <p>&copy; 2025 TheQuro. All rights reserved. Built with ❤️ for learners worldwide.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Footer;
