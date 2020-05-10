use crate::{Error, Storage};
use avro_rs::Schema;

#[derive(Clone, Debug)]
pub struct SqliteStorage {}

impl Storage for SqliteStorage {
    fn new() -> Self
    where
        Self: Sized,
    {
        unimplemented!()
    }

    fn get_schema_by_id(&self, id: &str) -> Schema {
        unimplemented!()
    }

    fn get_schema_by_name(&self, namespace: &str, name: &str, version: Option<u32>) -> Schema {
        unimplemented!()
    }

    fn add_new_schema(&self, schema: Schema) -> Result<(), Error> {
        unimplemented!()
    }
}
