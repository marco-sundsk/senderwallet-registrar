use crate::*;
use crate::user_info::HumanReadableUserInfo;
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::json_types::{ValidAccountId, U64};
use near_sdk::{AccountId};

#[derive(Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
#[cfg_attr(not(target_arch = "wasm32"), derive(Debug))]
pub struct ContractMetadata {
    pub version: String,
    pub owner_id: AccountId,
    pub operators: Vec<AccountId>,
    pub user_count: U64,
}

#[near_bindgen]
impl Contract {
    /// Return contract basic info
    pub fn metadata(&self) -> ContractMetadata {
        ContractMetadata {
            version: env!("CARGO_PKG_VERSION").to_string(),
            owner_id: self.data().owner_id.clone(),
            operators: self.data().operators.to_vec(),
            user_count: self.data().user_count.into(),
        }
    }

    pub fn get_user_info(&self, account_id: ValidAccountId) -> Option<HumanReadableUserInfo> {
        if let Some(ui) = self.data().users.get(account_id.as_ref()) {
            Some(ui.get_ref().into())
        } else {
            None
        }
    }
}
