import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import AppBar from "./appbar";

import "./app.scss";

const Schema = React.lazy(() => import("./schema"));

function App(): JSX.Element {
    return (
        <Router>
            <AppBar />
            <Switch>
                <Route path="/schema">
                    <React.Suspense fallback={<div>Loading...</div>}>
                        <Schema />
                    </React.Suspense>
                </Route>
            </Switch>
        </Router>
    );
}

export default App;
