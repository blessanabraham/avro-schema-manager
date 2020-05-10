use config::{Config, ConfigError, Environment, File, FileFormat};
use serde::Deserialize;

#[derive(Clone, Debug, Deserialize)]
pub struct Settings {
    pub host: String,
    pub port: String,
}

impl Settings {
    pub fn new(default: &str) -> Result<Self, ConfigError> {
        let mut settings = Config::new();

        settings.merge(File::from_str(default, FileFormat::Json))?;

        settings.merge(Environment::default().separator("_").ignore_empty(false))?;

        settings.try_into()
    }
}

pub fn get_settings() -> Settings {
    let default_settings = include_str!("./settings.json");
    let settings = Settings::new(default_settings).expect("Failed to load settings");

    debug!("Settings: {:#?}", settings);

    settings
}
