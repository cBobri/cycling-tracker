import { BiMobile, BiSolidFace, BiStats } from "react-icons/bi";
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <>
            <section className="bg-darkLight-900">
                <div className="py-32 px-6 xl:px-0 max-w-screen-xl mx-auto">
                    <h1 className="text-white text-6xl font-semibold font-robotoCondensed mb-6">
                        Cycling Tracker
                    </h1>

                    <p className="text-darkLight-300 text-xl mb-10">
                        Record your cycling adventures and visualize your
                        progress on our web application.
                    </p>

                    <Link
                        to={"/register"}
                        className="px-5 py-2 text-darkLight-200 text-2xl uppercase border-2 border-darkLight-200 rounded-3xl hover:bg-darkLight-200 hover:text-darkLight-900 transition-colors duration-300"
                    >
                        Join Us
                    </Link>
                </div>
            </section>

            <section>
                <div className="py-32 px-6 xl:px-0 max-w-screen-xl mx-auto">
                    <h2 className="text-5xl font-semibold font-robotoCondensed mb-12">
                        Features
                    </h2>

                    <article className="border-b border-darkLight-900 pb-5 mb-5">
                        <h3 className="flex gap-3 text-4xl mb-4">
                            <BiMobile />
                            <span>Mobile App</span>
                        </h3>

                        <ul className="ml-10 list-disc text-lg">
                            <li>Records your routes</li>
                            <li>
                                Finished routes are stored locally and can be
                                uploaded onto our server whenever
                            </li>
                            <li>Basic real-time statistics and map</li>
                        </ul>
                    </article>

                    <article className="border-b border-darkLight-900 pb-5 mb-5">
                        <h3 className="flex gap-3 text-4xl mb-4">
                            <BiStats />
                            <span>Statistics</span>
                        </h3>

                        <ul className="ml-10 list-disc text-lg">
                            <li>
                                Visualize your routes on our web application
                            </li>
                            <li>
                                See your distance travelled, speed, wattage,
                                calories burnt
                            </li>
                            <li>
                                Compare your performance with professionals on
                                similar tracks
                            </li>
                        </ul>
                    </article>

                    <article className="border-b border-darkLight-900 pb-5 mb-5">
                        <h3 className="flex gap-3 text-4xl mb-4">
                            <BiSolidFace />
                            <span>Two-Factor Authentication</span>
                        </h3>

                        <ul className="ml-10 list-disc text-lg">
                            <li>
                                Record a short video of your face on our mobile
                                app
                            </li>
                            <li>Receive notifications on login attempts</li>
                            <li>Verify yourself by scanning your face</li>
                        </ul>
                    </article>
                </div>
            </section>
        </>
    );
};

export default Home;
