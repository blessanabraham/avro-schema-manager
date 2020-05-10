import React from "react";
import SchemaList from "./list";
import GraphView from "./graph";
import FieldsView from "./fields";

import * as styles from "./schema.scss";

function Schema(): JSX.Element {
    return (
        <div className={styles.container}>
            <SchemaList />
            <GraphView />
            <FieldsView />
        </div>
    );
}

export default Schema;
