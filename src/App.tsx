import { type FC } from "react";
import { BrowserRouter } from "react-router-dom";
import { Helmet } from "react-helmet";
import Routes from "./routes/Routes";
import Manifest from "./manifest";
import { ToastContainer } from "react-toastify";

import Header from "./components/Header/Header";

const App: FC = () => {
    return (
        <BrowserRouter>
            <Helmet>
                <title>{Manifest.title}</title>
                <meta name="description" content={Manifest.description} />
                <meta name="keywords" content={Manifest.keywords} />
                <meta name="author" content={Manifest.author} />
            </Helmet>

            <Header />
            <ToastContainer />

            <main className="main">
                <Routes />
            </main>
        </BrowserRouter>
    );
};

export default App;
