use std::env;
use std::process::{Command, Stdio};

fn main() {
    let profile = env::var("PROFILE").unwrap();

    let mode: &str = match profile.as_str() {
        "release" => "production",
        _ => "development",
    };

    let manifest_dir = env::var("CARGO_MANIFEST_DIR").unwrap();

    let output = Command::new("npm")
        .arg("run")
        .arg("build")
        .current_dir("ui")
        .envs(vec![
            ("NODE_ENV", mode),
            ("OUT_DIR", manifest_dir.as_str()),
            ("INLINE_RUNTIME_CHUNK", "false"),
        ])
        .stdout(Stdio::piped())
        .stderr(Stdio::inherit())
        .output()
        .unwrap();

    println!("{}", String::from_utf8(output.stdout).unwrap());

    if !output.status.success() {
        let error = String::from_utf8(output.stderr).unwrap();
        panic!("UI build failed!\n{}", error);
    }
}
