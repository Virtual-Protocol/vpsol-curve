import { SwapResult, sellTokenWithFee, buyTokenWithFee, kFromXY, reverseSellTokenWithFee, reverseBuyTokenWithFee } from '../dist/node/virtuals_curve';
import { equal } from "assert";

describe('Virtuals Curve', () => {
  it('Get Price', async () => {
    let k = kFromXY(1000n, 1000n);
    equal(k,1000000n)
  })

  it('Buy Token With Zero Fee', async () => {
    let result: SwapResult = buyTokenWithFee(30n, 20n, 5n, 0);
    equal(result.virtuals_amount, 4n)
    equal(result.total_virtuals_amount, 4n)
    equal(result.fee_amount, 0n)
  })

  it('Sell Token With Zero Fee', async () => {
    let result: SwapResult = sellTokenWithFee(25n, 24n, 5n, 0);
    equal(result.virtuals_amount, 4n)
    equal(result.total_virtuals_amount, 4n)
    equal(result.fee_amount, 0n)
  })

  it('Reverse Buy Token With Zero Fee', async () => {
    let result: SwapResult = reverseBuyTokenWithFee(30n, 20n, 4n, 0);
    equal(result.token_amount, 5n)
    equal(result.total_virtuals_amount, 4n)
    equal(result.fee_amount, 0n)
  })

  it('Reverse Sell Token With Zero Fee', async () => {
    let result: SwapResult = reverseSellTokenWithFee(25n, 24n, 4n, 0);
    equal(result.token_amount, 5n)
    equal(result.total_virtuals_amount, 4n)
    equal(result.fee_amount, 0n)
  })

  it('Buy Token With 25.00% Fee', async () => {
    let result: SwapResult = buyTokenWithFee(30n, 20n, 5n, 2500);
    equal(result.virtuals_amount, 4n)
    equal(result.total_virtuals_amount, 5n)
    equal(result.fee_amount, 1n)
  })

  it('Sell Token With 25.00% Fee', async () => {
    let result: SwapResult = sellTokenWithFee(25n, 24n, 5n, 2500);
    equal(result.virtuals_amount, 3n)
    equal(result.total_virtuals_amount, 4n)
    equal(result.fee_amount, 1n)
  })
})