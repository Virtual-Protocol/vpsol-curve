/* tslint:disable */
/* eslint-disable */
export function init(): void;
export function kFromXY(x: bigint, y: bigint): bigint;
export function calculateFee(amount: bigint, fee: number): bigint;
export function spotPriceToken(token_balance: bigint, virtuals_balance: bigint, precision: number): bigint;
export function spotPriceVirtuals(token_balance: bigint, virtuals_balance: bigint, precision: number): bigint;
export function buyToken(token_balance: bigint, virtuals_balance: bigint, buy_amount: bigint): bigint;
export function sellToken(token_balance: bigint, virtuals_balance: bigint, sell_amount: bigint): bigint;
export function buyTokenWithFee(token_balance: bigint, virtuals_balance: bigint, buy_amount: bigint, fee: number): SwapResult;
export function sellTokenWithFee(token_balance: bigint, virtuals_balance: bigint, sell_amount: bigint, fee: number): SwapResult;
export function reverseBuyTokenWithFee(token_balance: bigint, virtuals_balance: bigint, buy_amount: bigint, fee: number): SwapResult;
export function reverseSellTokenWithFee(token_balance: bigint, virtuals_balance: bigint, sell_amount: bigint, fee: number): SwapResult;
export enum CurveError {
  ArithmeticOverflow = 0,
  RatioExceeded = 1,
  InvalidSupply = 2,
  ZeroAmount = 3,
}
export class SwapResult {
  private constructor();
  free(): void;
  virtuals_amount: bigint;
  token_amount: bigint;
  fee_amount: bigint;
  total_virtuals_amount: bigint;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_swapresult_free: (a: number, b: number) => void;
  readonly __wbg_get_swapresult_virtuals_amount: (a: number) => bigint;
  readonly __wbg_set_swapresult_virtuals_amount: (a: number, b: bigint) => void;
  readonly __wbg_get_swapresult_token_amount: (a: number) => bigint;
  readonly __wbg_set_swapresult_token_amount: (a: number, b: bigint) => void;
  readonly __wbg_get_swapresult_fee_amount: (a: number) => bigint;
  readonly __wbg_set_swapresult_fee_amount: (a: number, b: bigint) => void;
  readonly __wbg_get_swapresult_total_virtuals_amount: (a: number) => bigint;
  readonly __wbg_set_swapresult_total_virtuals_amount: (a: number, b: bigint) => void;
  readonly init: () => void;
  readonly kFromXY: (a: bigint, b: bigint) => [number, number, number];
  readonly calculateFee: (a: bigint, b: number) => [number, number, number];
  readonly spotPriceToken: (a: bigint, b: bigint, c: number) => [number, number, number];
  readonly spotPriceVirtuals: (a: bigint, b: bigint, c: number) => [number, number, number];
  readonly buyToken: (a: bigint, b: bigint, c: bigint) => [number, number, number];
  readonly sellToken: (a: bigint, b: bigint, c: bigint) => [number, number, number];
  readonly buyTokenWithFee: (a: bigint, b: bigint, c: bigint, d: number) => [number, number, number];
  readonly sellTokenWithFee: (a: bigint, b: bigint, c: bigint, d: number) => [number, number, number];
  readonly reverseBuyTokenWithFee: (a: bigint, b: bigint, c: bigint, d: number) => [number, number, number];
  readonly reverseSellTokenWithFee: (a: bigint, b: bigint, c: bigint, d: number) => [number, number, number];
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_export_3: WebAssembly.Table;
  readonly __externref_table_dealloc: (a: number) => void;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
