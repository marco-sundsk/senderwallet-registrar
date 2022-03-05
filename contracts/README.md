# Registrar Contract for Sender Wallet
An upgradable IMS contract for Sender-Wallet user management.

## Description
* Everyone can check a given user's information.  
* Operators can do all above and can add user information.  
* Owner can do all above and can upgrade the contract and management Operators.

### For Everyone
```rust
pub struct HumanReadableUserInfo {
    // user NEAR Account, the key to find a user
    pub account_id: AccountId,
    // user nick name on SenderWallet side
    pub user_name: String,
    // Timestamp (secs) that adding this user
    pub register_at: u32,
}

/// Check a given user's UserInfo
pub fn get_user_info(&self, account_id: ValidAccountId) -> Option<HumanReadableUserInfo>;
```

### For Operators
```rust
#[payable]
pub fn register_new_user(&mut self, accound_id: ValidAccountId, user_name: String);
```

### For Owner
```rust
pub fn set_owner(&mut self, owner_id: ValidAccountId);
pub fn extend_operators(&mut self, operators: Vec<ValidAccountId>);
pub fn remove_operators(&mut self, operators: Vec<ValidAccountId>);
```


## Build
1. Install `rustup` via [https://rustup.rs/](https://rustup.rs/)
2. Run the following:
    ```bash
    rustup default stable
    rustup target add wasm32-unknown-unknown
    ```
3. Build:
    ```bash
    cd sw-registrar
    ./build_local.sh
    ```
4. Test:
    ```bash
    cd sw-registrar
    cargo test
    ```

## Deploying to Testnet
To deploy to TestNet, you can use next command:
```bash
npm install -g near-cli
near dev-deploy res/sw_registrar_local.wasm
```
This will output on the contract ID it deployed.