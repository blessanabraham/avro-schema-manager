#[macro_use]
extern crate lazy_static;

lazy_static! {
    pub static ref SETTINGS: server::Settings = server::get_settings();
}

#[tokio::main]
async fn main() {
    env_logger::init();

    let settings = &SETTINGS as &'static server::Settings;

    let routes = server::routes(&settings);
    warp::serve(routes).run(server::addr(&settings)).await;
}
