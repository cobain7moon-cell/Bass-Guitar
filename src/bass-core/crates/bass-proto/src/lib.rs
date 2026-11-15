pub mod bass {
    pub mod controller {
        pub mod v1 {
            tonic::include_proto!("bass.controller.v1");
        }
    }
}

pub use bass::controller::v1;
