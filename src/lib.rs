use thiserror::Error;

#[cfg(feature = "anchor")]
use anchor_lang::error::{AnchorError, Error, ERROR_CODE_OFFSET};

#[cfg(target_arch = "wasm32")]
use wasm_bindgen::prelude::*;
#[cfg(target_arch = "wasm32")]
extern crate console_error_panic_hook;
#[cfg(target_arch = "wasm32")]
use std::panic;

#[derive(Debug)]
#[cfg_attr(target_arch = "wasm32", derive(serde::Serialize, serde::Deserialize), wasm_bindgen)]
pub struct SwapResult {
    pub virtuals_amount: u64,
    pub token_amount: u64,
    pub fee_amount: u64,
    pub total_virtuals_amount: u64
}

#[derive(Debug, Error)]
#[cfg_attr(target_arch = "wasm32", wasm_bindgen)]
pub enum CurveError {
    #[error("Curve Arithmetic Overflow")]
    ArithmeticOverflow,
    #[error("Asset Ratio Exceeded")]
    RatioExceeded,
    #[error("Invalid Supply")]
    InvalidSupply,
    #[error("Zero Amount")]
    ZeroAmount
}

#[cfg(feature = "anchor")]
impl From<CurveError> for Error {
    fn from(value: CurveError) -> Error {
        Error::AnchorError(Box::new(AnchorError {
            error_name: value.to_string(),
            error_msg: value.to_string(),
            error_code_number: ERROR_CODE_OFFSET + 1000 + value as u32,
            error_origin: None,
            compared_values: None,
        }))
    }
}


#[cfg(target_arch = "wasm32")]
#[wasm_bindgen(start)]
fn init() {
    panic::set_hook(Box::new(console_error_panic_hook::hook));
}

/// K from XY
/// 
/// Our static invariant calculation
#[inline]
pub fn k_from_xy_impl(x: u64, y: u64) -> Result<u128, CurveError> {
    if x == 0 || y == 0 {
        return Err(CurveError::ZeroAmount);
    }
    Ok((x as u128).checked_mul(y as u128).ok_or(CurveError::ArithmeticOverflow)?)
}

/// # Spot Price
/// 
/// Calculate spot price for a token in its opposing token
#[inline]
fn spot_price_impl(x: u64, y: u64, precision: u32) -> Result<u64, CurveError> {
    if x == 0 || y == 0 {
        return Err(CurveError::ZeroAmount);
    }
    Ok(
        u64::try_from(
            (x as u128)
            .checked_mul(precision as u128).ok_or(CurveError::ArithmeticOverflow)?
            .checked_div(y as u128).ok_or(CurveError::ArithmeticOverflow)?
            .checked_div(precision as u128).ok_or(CurveError::ArithmeticOverflow)?
        ).map_err(|_| CurveError::ArithmeticOverflow)?
    )
}

/// # Buy Token
/// 
/// Calculate amount of virtuals needed to buy tokens using constant product formula
#[inline]
fn buy_token_impl(token_balance: u64, virtuals_balance: u64, buy_amount: u64) -> Result<u64, CurveError> {
    if buy_amount >= token_balance {
        return Err(CurveError::ArithmeticOverflow);
    }
    
    let numerator = (virtuals_balance as u128).checked_mul(buy_amount as u128)
        .ok_or(CurveError::ArithmeticOverflow)?;
    let denominator = token_balance.checked_sub(buy_amount)
        .ok_or(CurveError::ArithmeticOverflow)? as u128;
    
    let amount = numerator.checked_div(denominator)
        .ok_or(CurveError::ArithmeticOverflow)?;
        
    let amount: u64 = amount.try_into().map_err(|_| CurveError::ArithmeticOverflow)?;

    if amount < 1 {
        return Err(CurveError::ZeroAmount)
    }

    Ok(amount)
}

/// # Reverse Buy Token
/// 
/// Calculate amount of tokens purchases for a certain amount of virtuals using constant product formula
#[inline]
fn reverse_buy_token_impl(token_balance: u64, virtuals_balance: u64, buy_amount: u64) -> Result<u64, CurveError> {
    // 1. We start from K = XY (Constant = Token x Virtuals)
    let k = k_from_xy_impl(token_balance, virtuals_balance)?;
    // 2. We calculate the new balance of X (Tokens)
    let new_virtuals_balance = (virtuals_balance as u128).checked_add(buy_amount as u128).ok_or(CurveError::ArithmeticOverflow)?;
    // 3. We calculate the new balance of Y (Virtuals)
    let new_token_balance: u64 = k.checked_div(new_virtuals_balance).ok_or(CurveError::ArithmeticOverflow)?.try_into().map_err(|_| CurveError::ArithmeticOverflow)?;
    // 4. Return our amount by subtracting new_virtuals_balance from old.
    let amount = token_balance.checked_sub(new_token_balance).ok_or(CurveError::ArithmeticOverflow.into())?;

    if amount < 1 {
        return Err(CurveError::ZeroAmount)
    }

    Ok(amount)
}

/// # Sell Token
/// 
/// Calculate amount of virtuals received when selling tokens using constant product formula
#[inline]
fn sell_token_impl(token_balance: u64, virtuals_balance: u64, sell_amount: u64) -> Result<u64, CurveError> {

    let numerator = (virtuals_balance as u128).checked_mul(sell_amount as u128)
        .ok_or(CurveError::ArithmeticOverflow)?;
    let denominator = (token_balance as u128).checked_add(sell_amount as u128)
        .ok_or(CurveError::ArithmeticOverflow)?;
    
    let amount = numerator.checked_div(denominator)
        .ok_or(CurveError::ArithmeticOverflow)? as u64;
    // // 1. We start from K = XY (Constant = Token x Virtuals)
    // let k = k_from_xy_impl(token_balance, virtuals_balance)?;
    // // 2. We calculate the new balance of X (Tokens)
    // let new_token_balance = token_balance.checked_add(sell_amount).ok_or(CurveError::ArithmeticOverflow)? as u128;
    // // 3. We calculate the new balance of Y (Virtuals)
    // let new_virtuals_balance: u64 = k.checked_div(new_token_balance)
    //     .ok_or(CurveError::ArithmeticOverflow)?
    //     .try_into()
    //     .map_err(|_| CurveError::ArithmeticOverflow)?;
    // // 4. Return our amount by subtracting new_virtuals_balance from old.
    // let amount = virtuals_balance.checked_sub(new_virtuals_balance).ok_or(CurveError::ArithmeticOverflow.into())?;

    if amount < 1 {
        return Err(CurveError::ZeroAmount)
    }
    
    Ok(amount)
}

/// # Reverse Sell Token
/// 
/// Calculate amount of tokens you would need to sell to receive a certain amount or virtuals using constant product formula
#[inline]
fn reverse_sell_token_impl(token_balance: u64, virtuals_balance: u64, sell_amount: u64) -> Result<u64, CurveError> {
    // 1. We start from K = XY (Constant = Token x Virtuals)
    let k = k_from_xy_impl(token_balance, virtuals_balance)?;
    // 2. We calculate the new balance of X (Tokens)
    let new_virtuals_balance = virtuals_balance.checked_sub(sell_amount).ok_or(CurveError::ArithmeticOverflow)? as u128;
    // 3. We calculate the new balance of Y (Virtuals)
    let new_token_balance: u64 = k.checked_div(new_virtuals_balance)
        .ok_or(CurveError::ArithmeticOverflow)?
        .try_into()
        .map_err(|_| CurveError::ArithmeticOverflow)?;
    // 4. Return our amount by subtracting new_virtuals_balance from old.
    let amount = new_token_balance.checked_sub(token_balance).ok_or(CurveError::ArithmeticOverflow.into())?;

    if amount < 1 {
        return Err(CurveError::ZeroAmount)
    }
    
    Ok(amount)
}

#[inline]
fn calculate_fee_impl(amount: u64, fee: u16) -> Result<u64, CurveError> {
    let fee: u64 = (amount as u128)
        .checked_mul(fee as u128).ok_or(CurveError::ArithmeticOverflow)?
        .saturating_div(10_000u128)
        .try_into()
        .map_err(|_| CurveError::ArithmeticOverflow)?;
    Ok(fee)
}

/// # Buy Token With Fee
/// 
/// Calculate the amount, fee and total in virtuals a user must pay to buy a certain amount of tokens
#[inline]
fn buy_token_with_fee_impl(token_balance: u64, virtuals_balance: u64, buy_amount: u64, fee_bp: u16) -> Result<SwapResult, CurveError> {
    let virtuals_amount = buy_token_impl(token_balance, virtuals_balance, buy_amount)?;
    let fee_amount = calculate_fee_impl(virtuals_amount, fee_bp)?;
    let total_virtuals_amount = virtuals_amount.checked_add(fee_amount).ok_or(CurveError::ArithmeticOverflow)?;
    Ok(SwapResult { token_amount: buy_amount, fee_amount, virtuals_amount, total_virtuals_amount })
}

/// # Sell Token With Fee
/// 
/// Calculate the amount, fee and total in virtuals a user will receive for selling a certain amount of tokens
#[inline]
fn sell_token_with_fee_impl(token_balance: u64, virtuals_balance: u64, sell_amount: u64, fee_bp: u16) -> Result<SwapResult, CurveError> {
    let total_virtuals_amount = sell_token_impl(token_balance, virtuals_balance, sell_amount)?;
    let fee_amount = calculate_fee_impl(total_virtuals_amount, fee_bp)?;
    let virtuals_amount = total_virtuals_amount.checked_sub(fee_amount).ok_or(CurveError::ArithmeticOverflow)?;
    Ok(SwapResult { token_amount: sell_amount, fee_amount, virtuals_amount, total_virtuals_amount })
}

/// # Reverse Buy Token With Fee
/// 
/// Calculate the fee paid and token amount received by a user for a particular amount of virtuals
#[inline]
fn reverse_buy_token_with_fee_impl(token_balance: u64, virtuals_balance: u64, buy_amount: u64, fee_bp: u16) -> Result<SwapResult, CurveError> {
    let fee_amount = calculate_fee_impl(buy_amount, fee_bp)?;
    let virtuals_amount = buy_amount.checked_sub(fee_amount).ok_or(CurveError::ArithmeticOverflow)?;
    let token_amount = reverse_buy_token_impl(token_balance, virtuals_balance, virtuals_amount)?;
    Ok(SwapResult {
        token_amount,
        fee_amount,
        virtuals_amount,
        total_virtuals_amount: buy_amount
    })
}

/// # Reverse Sell Token With Fee
/// 
/// Calculate the fee paid and token amount required for a user to receive a particular amount of virtuals
#[inline]
fn reverse_sell_token_with_fee_impl(token_balance: u64, virtuals_balance: u64, sell_amount: u64, fee_bp: u16) -> Result<SwapResult, CurveError> {
    // Calculate the fee on top of the sell amount we want to receive
    let fee_amount = calculate_fee_impl(sell_amount, fee_bp)?;
    // Calculate the total amount of virtuals we want to get out, including the fee
    let total_virtuals_amount = sell_amount.checked_add(fee_amount).ok_or(CurveError::ArithmeticOverflow)?;
    // Calculate the number of tokens we'd need to see for our desired virtuals amount
    let token_amount = reverse_sell_token_impl(token_balance, virtuals_balance, total_virtuals_amount)?;
    Ok(SwapResult {
        token_amount,
        fee_amount,
        virtuals_amount: sell_amount,
        total_virtuals_amount
    })
}

// Native interfaces
#[cfg(not(target_arch = "wasm32"))]
pub fn k_from_xy(x: u64, y: u64) -> Result<u128, CurveError> {
    k_from_xy_impl(x, y)
}

#[cfg(not(target_arch = "wasm32"))]
pub fn calculate_fee(amount: u64, fee: u16) -> Result<u64, CurveError> {
    calculate_fee_impl(amount, fee)
}

#[cfg(not(target_arch = "wasm32"))]
pub fn spot_price_token(token_balance: u64, virtuals_balance: u64, precision: u32) -> Result<u64, CurveError> {
    spot_price_impl(token_balance, virtuals_balance, precision)
}

#[cfg(not(target_arch = "wasm32"))]
pub fn spot_price_virtuals(token_balance: u64, virtuals_balance: u64, precision: u32) -> Result<u64, CurveError> {
    spot_price_impl(virtuals_balance, token_balance, precision)
}

#[cfg(not(target_arch = "wasm32"))]
pub fn buy_token(token_balance: u64, virtuals_balance: u64, buy_amount: u64) -> Result<u64, CurveError> {
    buy_token_impl(token_balance, virtuals_balance, buy_amount)
}

#[cfg(not(target_arch = "wasm32"))]
pub fn sell_token(token_balance: u64, virtuals_balance: u64, sell_amount: u64) -> Result<u64, CurveError> {
    sell_token_impl(token_balance, virtuals_balance, sell_amount)
}

#[cfg(not(target_arch = "wasm32"))]
pub fn buy_token_with_fee(token_balance: u64, virtuals_balance: u64, buy_amount: u64, fee: u16) -> Result<SwapResult, CurveError> {
    buy_token_with_fee_impl(token_balance, virtuals_balance, buy_amount, fee)
}

#[cfg(not(target_arch = "wasm32"))]
pub fn sell_token_with_fee(token_balance: u64, virtuals_balance: u64, sell_amount: u64, fee: u16) -> Result<SwapResult, CurveError> {
    sell_token_with_fee_impl(token_balance, virtuals_balance, sell_amount, fee)
}

#[cfg(not(target_arch = "wasm32"))]
pub fn reverse_buy_token_with_fee(token_balance: u64, virtuals_balance: u64, buy_amount: u64, fee: u16) -> Result<SwapResult, CurveError> {
    reverse_buy_token_with_fee_impl(token_balance, virtuals_balance, buy_amount, fee)
}

#[cfg(not(target_arch = "wasm32"))]
pub fn reverse_sell_token_with_fee(token_balance: u64, virtuals_balance: u64, sell_amount: u64, fee: u16) -> Result<SwapResult, CurveError> {
    reverse_sell_token_with_fee_impl(token_balance, virtuals_balance, sell_amount, fee)
}

// Wasm interfaces
#[cfg(target_arch = "wasm32")]
#[wasm_bindgen(js_name = kFromXY)]
pub fn k_from_xy(x: u64, y: u64) -> Result<js_sys::BigInt, JsError> {
    Ok(k_from_xy_impl(x, y).map_err(|e| JsError::new(&e.to_string()))?.into())
}

#[cfg(target_arch = "wasm32")]
#[wasm_bindgen(js_name = calculateFee)]
pub fn calculate_fee(amount: u64, fee: u16) -> Result<js_sys::BigInt, JsError> {
    Ok(calculate_fee_impl(amount, fee).map_err(|e| JsError::new(&e.to_string()))?.into())
}

#[cfg(target_arch = "wasm32")]
#[wasm_bindgen(js_name = spotPriceToken)]
pub fn spot_price_token(token_balance: u64, virtuals_balance: u64, precision: u32) -> Result<js_sys::BigInt, CurveError> {
    Ok(spot_price_impl(token_balance, virtuals_balance, precision)?.into())
}

#[cfg(target_arch = "wasm32")]
#[wasm_bindgen(js_name = spotPriceVirtuals)]
pub fn spot_price_virtuals(token_balance: u64, virtuals_balance: u64, precision: u32) -> Result<js_sys::BigInt, CurveError> {
    Ok(spot_price_impl(virtuals_balance, token_balance, precision)?.into())
}

#[cfg(target_arch = "wasm32")]
#[wasm_bindgen(js_name = buyToken)]
pub fn buy_token(token_balance: u64, virtuals_balance: u64, buy_amount: u64) -> Result<js_sys::BigInt, JsError> {
    Ok(buy_token_impl(token_balance, virtuals_balance, buy_amount).map_err(|e| JsError::new(&e.to_string()))?.into())
}

#[cfg(target_arch = "wasm32")]
#[wasm_bindgen(js_name = sellToken)]
pub fn sell_token(token_balance: u64, virtuals_balance: u64, sell_amount: u64) -> Result<js_sys::BigInt, JsError> {
    Ok(sell_token_impl(token_balance, virtuals_balance, sell_amount).map_err(|e| JsError::new(&e.to_string()))?.into())
}

#[cfg(target_arch = "wasm32")]
#[wasm_bindgen(js_name = buyTokenWithFee)]
pub fn buy_token_with_fee(token_balance: u64, virtuals_balance: u64, buy_amount: u64, fee: u16) -> Result<SwapResult, JsError> {
    buy_token_with_fee_impl(token_balance, virtuals_balance, buy_amount, fee).map_err(|e| JsError::new(&e.to_string()))
}

#[cfg(target_arch = "wasm32")]
#[wasm_bindgen(js_name = sellTokenWithFee)]
pub fn sell_token_with_fee(token_balance: u64, virtuals_balance: u64, sell_amount: u64, fee: u16) -> Result<SwapResult, JsError> {
    sell_token_with_fee_impl(token_balance, virtuals_balance, sell_amount, fee).map_err(|e| JsError::new(&e.to_string()))
}

#[cfg(target_arch = "wasm32")]
#[wasm_bindgen(js_name = reverseBuyTokenWithFee)]
pub fn reverse_buy_token_with_fee(token_balance: u64, virtuals_balance: u64, buy_amount: u64, fee: u16) -> Result<SwapResult, JsError> {
    reverse_buy_token_with_fee_impl(token_balance, virtuals_balance, buy_amount, fee).map_err(|e| JsError::new(&e.to_string()))
}

#[cfg(target_arch = "wasm32")]
#[wasm_bindgen(js_name = reverseSellTokenWithFee)]
pub fn reverse_sell_token_with_fee(token_balance: u64, virtuals_balance: u64, sell_amount: u64, fee: u16) -> Result<SwapResult, JsError> {
    reverse_sell_token_with_fee_impl(token_balance, virtuals_balance, sell_amount, fee).map_err(|e| JsError::new(&e.to_string()))
}

#[cfg(test)]
mod tests {
    use crate::{buy_token, buy_token_with_fee, reverse_buy_token_with_fee, reverse_sell_token_with_fee, sell_token_with_fee, SwapResult};
    #[test]
    fn swap() {
        // Execute a buy
        // K = 25*24 = 600
        // X2 = 25
        // Y2 = 600/25 = 24
        // Y2 - Y = 4
        let SwapResult { virtuals_amount, ..} = buy_token_with_fee(30, 20, 5, 0).unwrap();
        assert_eq!(virtuals_amount, 4);
        // Execute the reverse sell
        // K = XY,
        // 600 = 25/24
        // X2 = 30
        // Y2 = 600/30 = 20
        // Y2 - Y = 4
        let SwapResult { virtuals_amount, ..} = sell_token_with_fee(25, 24, 5, 0).unwrap();
        assert_eq!(virtuals_amount, 4);
    }

    #[test]
    fn reverse_swap() {
        // Execute a reverse buy
        // 600 = 30*20
        // Y2 = 24
        // X2 = 600/24 = 25
        // X - X2 = 5
        let SwapResult { token_amount, ..} = reverse_buy_token_with_fee(30, 20, 4, 0).unwrap();
        assert_eq!(token_amount, 5);
        // Execute a reverse sell
        // 600 = 25*24
        // Y2 = 20
        // X2 = 600/20 = 30
        // X2 - X = 5
        let SwapResult { token_amount, ..} = reverse_sell_token_with_fee(25, 24, 4, 0).unwrap();
        assert_eq!(token_amount, 5);
    }

    #[test]
    fn swap_with_fee() {
        // Execute a sell
        // K = XY,
        // 600 = 20/30
        // X2 = 25
        // Y2 = 600/25 = 24
        // Y - Y2 = 6
        // 6 * 1667 / 10000 = 1
        let SwapResult { virtuals_amount, fee_amount, .. } = sell_token_with_fee(20, 30, 5, 1667).unwrap();
        assert_eq!(virtuals_amount, 5);
        assert_eq!(fee_amount, 1);
        // Execute a sell
        // K = XY,
        // 600 = 20/30
        // X2 = 25
        // Y2 = 600/25 = 24
        // Y - Y2 = 6
        // 6 * 1666 / 10000 = 0
        let SwapResult { virtuals_amount, fee_amount, .. } = sell_token_with_fee(20, 30, 5, 1666).unwrap();
        assert_eq!(virtuals_amount, 6);
        assert_eq!(fee_amount, 0);
    }

    #[test]
    fn test_overflow() {
        assert!(buy_token(u64::MAX, u64::MAX, u64::MAX).is_err());
    }

    #[test]
    fn test_real_pool_values() {
        let buy = buy_token_with_fee(1_000_000_000_000_000, 6_000_000_000_000, 20000000000000, 100).unwrap();
        println!("{:#?}", buy);
        let sell = sell_token_with_fee(980_000_000_000_000, 6_000_000_000_000 + buy.virtuals_amount, 20000000000000, 100).unwrap();
        println!("{:#?}", sell);
        assert_eq!(buy.virtuals_amount, sell.total_virtuals_amount)
    }
}