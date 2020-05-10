use avro_rs::Schema;

pub trait Storage {
    /// Initialize connections and create required tables if they do not exist
    fn new() -> Self
    where
        Self: Sized;

    /// Get the Schema with `id`
    fn get_schema_by_id(&self, id: &str) -> Schema;

    /// Get the Schema with the namespace, name and optional version.
    /// If version is not specified, the latest version is assumed
    fn get_schema_by_name(&self, namespace: &str, name: &str, version: Option<u32>) -> Schema;

    /// Add a new schema to the storage.
    /// If a schema with the same name and namespace already exists, an error must be returned.
    fn add_new_schema(&self, schema: Schema) -> Result<(), Error>;
}

mod sqlite;

mod error;
pub use error::Error;
