import React from "react";
import { gql, useQuery } from "@apollo/client";

import * as styles from "./schemaList.scss";

interface AvroSchema {
    id: string;
    namespace: string;
    name: string;
    versions: number[];
}

interface AvroSchemaData {
    schemas: AvroSchema[];
}

const GET_ALL_SCHEMA = gql`
    query GetAllSchema {
        schemas {
            id
            name
            namespace
            versions
        }
    }
`;

function SchemaList(): JSX.Element {
    const { loading, error, data } = useQuery<AvroSchemaData>(GET_ALL_SCHEMA);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{`Error! ${error.message}`}</div>;

    return (
        <table className={styles.schemaList}>
            <tbody>
                {data?.schemas?.map((schema) => {
                    return (
                        <tr key={schema.id}>
                            <td>{`${schema.namespace}.${schema.name}`}</td>
                            <td>
                                {schema.versions[schema.versions.length - 1]}
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}

export default SchemaList;
