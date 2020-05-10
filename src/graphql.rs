use async_graphql::http::GQLResponse;
use async_graphql::*;
use async_graphql_warp::graphql;
use std::convert::Infallible;
use warp::{Filter, Rejection, Reply};

#[SimpleObject]
struct AvroSchema {
    id: String,
    namespace: String,
    name: String,
    versions: Vec<u32>,
}

struct QueryRoot;

#[Object]
impl QueryRoot {
    async fn schemas(&self) -> FieldResult<Vec<AvroSchema>> {
        let data = vec![
            AvroSchema {
                id: "asbc".to_string(),
                namespace: "com.blippar".to_string(),
                name: "root".to_string(),
                versions: vec![1, 2, 3, 4],
            },
            AvroSchema {
                id: "zxc".to_string(),
                namespace: "com.blippar.project".to_string(),
                name: "created".to_string(),
                versions: vec![1, 2],
            },
        ];

        Ok(data)
    }
}

pub fn handler() -> impl Filter<Extract = (impl Reply,), Error = Rejection> + Clone {
    let schema = Schema::build(QueryRoot, EmptyMutation, EmptySubscription).finish();
    graphql(schema).and_then(|(schema, builder): (_, QueryBuilder)| async move {
        let resp = builder.execute(&schema).await;
        Ok::<_, Infallible>(warp::reply::json(&GQLResponse(resp)).into_response())
    })
}
