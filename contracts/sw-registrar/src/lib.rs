use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::json_types::{ValidAccountId};
use near_sdk::collections::{LookupMap, UnorderedSet};
use near_sdk::{env, near_bindgen, AccountId, PanicOnDefault};
use near_sdk::BorshStorageKey;

use crate::user_info::VersionedUserInfo;

mod user_info;
mod owner;
mod utils;

near_sdk::setup_alloc!();

#[derive(BorshStorageKey, BorshSerialize)]
pub(crate) enum StorageKeys {
    User,
    Operator,
}

#[derive(BorshDeserialize, BorshSerialize)]
pub struct ContractData {
    /// owner of this contract
    owner_id: AccountId,
    /// Set of operators.
    operators: UnorderedSet<AccountId>,
    /// user info map
    users: LookupMap<AccountId, VersionedUserInfo>,
    /// for statistic
    user_count: u64,
}

#[derive(BorshSerialize, BorshDeserialize)]
pub enum VersionedContractData {
    V100(ContractData),
}

impl VersionedContractData {}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct Contract {
    data: VersionedContractData,
}

#[near_bindgen]
impl Contract {
    #[init]
    pub fn new(owner_id: ValidAccountId) -> Self {
        assert!(!env::state_exists(), "Already initialized");
        Self {
            data: VersionedContractData::V100(ContractData {
                owner_id: owner_id.into(),
                operators: UnorderedSet::new(StorageKeys::Operator),
                users: LookupMap::new(StorageKeys::User),
                user_count: 0,
            }),
        }
    }
}

impl Contract {
    fn data(&self) -> &ContractData {
        match &self.data {
            VersionedContractData::V100(data) => data,
            // _ => unimplemented!(),
        }
    }

    fn data_mut(&mut self) -> &mut ContractData {
        match &mut self.data {
            VersionedContractData::V100(data) => data,
            // _ => unimplemented!(),
        }
    }

    fn is_owner_or_operators(&self) -> bool {
        env::predecessor_account_id() == self.data().owner_id 
            || self.data().operators.contains(&env::predecessor_account_id())
    }
}