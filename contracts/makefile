RFLAGS="-C link-arg=-s"

all: sw

sw: sw-registrar
	mkdir -p res
	rustup target add wasm32-unknown-unknown
	cd sw-registrar && RUSTFLAGS=$(RFLAGS) cargo +stable build -p sw_registrar --target wasm32-unknown-unknown --release
	cd ..
	cp target/wasm32-unknown-unknown/release/sw_registrar.wasm ./res/sw_registrar_local.wasm

test: test-sw

TEST_FILE ?= **
LOGS ?=
test-sw: sw
	NEAR_PRINT_LOGS=$(LOGS) npx near-workspaces-ava --timeout=2m __tests__/sw-registrar/$(TEST_FILE).ava.ts --verbose

clean:
	rm res/*_local.wasm
