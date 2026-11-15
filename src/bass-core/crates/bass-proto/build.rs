fn main() -> Result<(), Box<dyn std::error::Error>> {
    let proto_file = "../../../proto/bass_controller.proto";
    println!("cargo:rerun-if-changed={}", proto_file);
    println!("cargo:rerun-if-changed=../../../proto");
    tonic_prost_build::configure()
        .build_server(true)
        .build_client(true)
        .compile_protos(&[proto_file], &["../../../proto"])?;
    Ok(())
}
