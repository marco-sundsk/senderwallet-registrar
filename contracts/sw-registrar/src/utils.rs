use near_sdk::{Timestamp};

pub type TimestampSec = u32;

pub(crate) fn to_sec(timestamp: Timestamp) -> TimestampSec {
    (timestamp / 10u64.pow(9)) as u32
}