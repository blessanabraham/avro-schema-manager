import React from "react";
import { Link } from "react-router-dom";

import * as styles from "./appbar.scss";

function AppBar(): JSX.Element {
    return (
        <div className={styles.container}>
            <Link to="/" className={styles.logo}>
                <h2>Avro Schema Manager</h2>
            </Link>
        </div>
    );
}

export default AppBar;
