#[macro_use]
extern crate log;

mod settings;
pub use settings::{get_settings, Settings};

mod error;

mod graphql;

use std::collections::HashMap;
use std::convert::{Infallible, TryFrom};
use std::net::SocketAddr;
use warp::{
    http::{header, HeaderMap, StatusCode},
    Filter, Rejection, Reply,
};

fn alive() -> impl Filter<Extract = (impl Reply,), Error = Rejection> + Copy {
    warp::get().and(
        warp::path("alive")
            .and(warp::path::end())
            .map(|| Ok(StatusCode::NO_CONTENT)),
    )
}

fn build_headers() -> HeaderMap {
    #[allow(clippy::mutable_key_type)]
    let mut map = HashMap::new();
    map.insert(
        header::CONTENT_SECURITY_POLICY_REPORT_ONLY,
        "default-src 'self'; report-uri /violations/".to_string(),
    );
    map.insert(header::X_XSS_PROTECTION, "1; mode=block".to_string());
    map.insert(
        header::STRICT_TRANSPORT_SECURITY,
        "max-age=31536000; includeSubDomains; preload".to_string(),
    );
    map.insert(header::X_FRAME_OPTIONS, "SAMEORIGIN".to_string());
    map.insert(header::X_CONTENT_TYPE_OPTIONS, "nosniff".to_string());

    HeaderMap::try_from(&map).expect("invalid headers")
}

fn index() -> impl Filter<Extract = (impl Reply,), Error = Rejection> + Clone {
    let headers = build_headers();
    let index = warp::fs::file("./public/index.html").with(warp::reply::with::headers(headers));

    warp::get().and(index)
}

fn assets() -> impl Filter<Extract = (impl Reply,), Error = Rejection> + Clone {
    let files = warp::path("static").and(warp::fs::dir("./public/"));

    warp::get().and(files)
}

pub fn routes(
    settings: &'static Settings,
) -> impl Filter<Extract = (impl Reply,), Error = Infallible> + Clone {
    alive()
        .or(assets())
        .or(graphql::handler())
        .or(index())
        .recover(error::handle_rejection)
        .with(warp::log("avro-schema-manager"))
}

pub fn addr(settings: &'static Settings) -> SocketAddr {
    format!("{}:{}", settings.host, settings.port)
        .parse()
        .expect("Invalid Host/Port specified")
}
