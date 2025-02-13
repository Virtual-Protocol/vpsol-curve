/* tslint:disable */
/* eslint-disable */
export const memory: WebAssembly.Memory;
export const __wbg_swapresult_free: (a: number, b: number) => void;
export const __wbg_get_swapresult_virtuals_amount: (a: number) => bigint;
export const __wbg_set_swapresult_virtuals_amount: (a: number, b: bigint) => void;
export const __wbg_get_swapresult_token_amount: (a: number) => bigint;
export const __wbg_set_swapresult_token_amount: (a: number, b: bigint) => void;
export const __wbg_get_swapresult_fee_amount: (a: number) => bigint;
export const __wbg_set_swapresult_fee_amount: (a: number, b: bigint) => void;
export const __wbg_get_swapresult_total_virtuals_amount: (a: number) => bigint;
export const __wbg_set_swapresult_total_virtuals_amount: (a: number, b: bigint) => void;
export const init: () => void;
export const kFromXY: (a: bigint, b: bigint) => [number, number, number];
export const calculateFee: (a: bigint, b: number) => [number, number, number];
export const spotPriceToken: (a: bigint, b: bigint, c: number) => [number, number, number];
export const spotPriceVirtuals: (a: bigint, b: bigint, c: number) => [number, number, number];
export const buyToken: (a: bigint, b: bigint, c: bigint) => [number, number, number];
export const sellToken: (a: bigint, b: bigint, c: bigint) => [number, number, number];
export const buyTokenWithFee: (a: bigint, b: bigint, c: bigint, d: number) => [number, number, number];
export const sellTokenWithFee: (a: bigint, b: bigint, c: bigint, d: number) => [number, number, number];
export const reverseBuyTokenWithFee: (a: bigint, b: bigint, c: bigint, d: number) => [number, number, number];
export const reverseSellTokenWithFee: (a: bigint, b: bigint, c: bigint, d: number) => [number, number, number];
export const __wbindgen_free: (a: number, b: number, c: number) => void;
export const __wbindgen_malloc: (a: number, b: number) => number;
export const __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
export const __wbindgen_export_3: WebAssembly.Table;
export const __externref_table_dealloc: (a: number) => void;
export const __wbindgen_start: () => void;
