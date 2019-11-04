FROM rust:1.37 AS builder
WORKDIR /usr/src/buck

COPY Cargo.toml .
COPY Cargo.lock .

# Layer hack: Build an empty program to compile dependencies and place on their own layer.
# This cuts down build time
RUN mkdir -p ./src/ && \
    echo 'fn main() {}' > ./src/main.rs && \
    echo '' > ./src/lib.rs
RUN cargo fetch
RUN cargo build --release && \
    rm -rf ./target/release/.fingerprint/buck-*

# Build real binaries now
COPY ./src ./src
RUN cargo build --release

FROM debian:stretch-slim
WORKDIR /usr/app
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
COPY --from=builder /usr/src/buck/target/release/buck .
CMD ["./buck"]