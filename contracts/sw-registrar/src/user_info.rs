use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{AccountId};

#[derive(BorshSerialize, BorshDeserialize)]
#[cfg_attr(feature = "test", derive(Clone))]
pub struct UserInfo {
    /// The Farming Token this FarmSeed represented for
    pub account_id: AccountId,
    pub user_name: String,
    pub register_at: u32,
}

impl UserInfo {
    pub fn new(account_id: &AccountId, user_name: &String) -> Self {
        Self {
            account_id: account_id.clone(),
            user_name: user_name.clone(),
            register_at: 0,
        }
    }
}

#[derive(Debug, Serialize, Deserialize, PartialEq, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct HumanReadableUserInfo {
    pub account_id: AccountId,
    pub user_name: String,
    pub register_at: u32,
}

impl From<&UserInfo> for HumanReadableUserInfo {
    fn from(ui: &UserInfo) -> Self {
        Self {
            account_id: ui.account_id.clone(),
            user_name: ui.user_name.clone(),
            register_at: ui.register_at,
        }
    }
}

#[derive(BorshSerialize, BorshDeserialize)]
pub enum VersionedUserInfo {
    V100(UserInfo),
}

impl VersionedUserInfo {

    pub fn new(account_id: &AccountId, user_name: &String) -> Self {
        VersionedUserInfo::V100(UserInfo::new(account_id, user_name))
    }

    /// Upgrades from other versions to the currently used version.
    pub fn upgrade(self) -> Self {
        match self {
            VersionedUserInfo::V100(ui) => VersionedUserInfo::V100(ui),
        }
    }

    #[inline]
    #[allow(unreachable_patterns)]
    pub fn need_upgrade(&self) -> bool {
        match self {
            VersionedUserInfo::V100(_) => false,
            _ => true,
        }
    }

    #[inline]
    #[allow(unreachable_patterns)]
    pub fn get_ref(&self) -> &UserInfo {
        match self {
            VersionedUserInfo::V100(ui) => ui,
            _ => unimplemented!(),
        }
    }

    #[inline]
    #[allow(unreachable_patterns)]
    pub fn get_ref_mut(&mut self) -> &mut UserInfo {
        match self {
            VersionedUserInfo::V100(ui) => ui,
            _ => unimplemented!(),
        }
    }
}


