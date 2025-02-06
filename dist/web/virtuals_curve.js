let wasm;

const cachedTextDecoder = (typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }) : { decode: () => { throw Error('TextDecoder not available') } } );

if (typeof TextDecoder !== 'undefined') { cachedTextDecoder.decode(); };

let cachedUint8ArrayMemory0 = null;

function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

let WASM_VECTOR_LEN = 0;

const cachedTextEncoder = (typeof TextEncoder !== 'undefined' ? new TextEncoder('utf-8') : { encode: () => { throw Error('TextEncoder not available') } } );

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachedDataViewMemory0 = null;

function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

export function init() {
    wasm.init();
}

function takeFromExternrefTable0(idx) {
    const value = wasm.__wbindgen_export_3.get(idx);
    wasm.__externref_table_dealloc(idx);
    return value;
}
/**
 * @param {bigint} x
 * @param {bigint} y
 * @returns {bigint}
 */
export function kFromXY(x, y) {
    const ret = wasm.kFromXY(x, y);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {bigint} amount
 * @param {number} fee
 * @returns {bigint}
 */
export function calculateFee(amount, fee) {
    const ret = wasm.calculateFee(amount, fee);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {bigint} token_balance
 * @param {bigint} virtuals_balance
 * @param {number} precision
 * @returns {bigint}
 */
export function spotPriceToken(token_balance, virtuals_balance, precision) {
    const ret = wasm.spotPriceToken(token_balance, virtuals_balance, precision);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {bigint} token_balance
 * @param {bigint} virtuals_balance
 * @param {number} precision
 * @returns {bigint}
 */
export function spotPriceVirtuals(token_balance, virtuals_balance, precision) {
    const ret = wasm.spotPriceVirtuals(token_balance, virtuals_balance, precision);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {bigint} token_balance
 * @param {bigint} virtuals_balance
 * @param {bigint} buy_amount
 * @returns {bigint}
 */
export function buyToken(token_balance, virtuals_balance, buy_amount) {
    const ret = wasm.buyToken(token_balance, virtuals_balance, buy_amount);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {bigint} token_balance
 * @param {bigint} virtuals_balance
 * @param {bigint} sell_amount
 * @returns {bigint}
 */
export function sellToken(token_balance, virtuals_balance, sell_amount) {
    const ret = wasm.sellToken(token_balance, virtuals_balance, sell_amount);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {bigint} token_balance
 * @param {bigint} virtuals_balance
 * @param {bigint} buy_amount
 * @param {number} fee
 * @returns {SwapResult}
 */
export function buyTokenWithFee(token_balance, virtuals_balance, buy_amount, fee) {
    const ret = wasm.buyTokenWithFee(token_balance, virtuals_balance, buy_amount, fee);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return SwapResult.__wrap(ret[0]);
}

/**
 * @param {bigint} token_balance
 * @param {bigint} virtuals_balance
 * @param {bigint} sell_amount
 * @param {number} fee
 * @returns {SwapResult}
 */
export function sellTokenWithFee(token_balance, virtuals_balance, sell_amount, fee) {
    const ret = wasm.sellTokenWithFee(token_balance, virtuals_balance, sell_amount, fee);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return SwapResult.__wrap(ret[0]);
}

/**
 * @param {bigint} token_balance
 * @param {bigint} virtuals_balance
 * @param {bigint} buy_amount
 * @param {number} fee
 * @returns {SwapResult}
 */
export function reverseBuyTokenWithFee(token_balance, virtuals_balance, buy_amount, fee) {
    const ret = wasm.reverseBuyTokenWithFee(token_balance, virtuals_balance, buy_amount, fee);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return SwapResult.__wrap(ret[0]);
}

/**
 * @param {bigint} token_balance
 * @param {bigint} virtuals_balance
 * @param {bigint} sell_amount
 * @param {number} fee
 * @returns {SwapResult}
 */
export function reverseSellTokenWithFee(token_balance, virtuals_balance, sell_amount, fee) {
    const ret = wasm.reverseSellTokenWithFee(token_balance, virtuals_balance, sell_amount, fee);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return SwapResult.__wrap(ret[0]);
}

/**
 * @enum {0 | 1 | 2 | 3}
 */
export const CurveError = Object.freeze({
    ArithmeticOverflow: 0, "0": "ArithmeticOverflow",
    RatioExceeded: 1, "1": "RatioExceeded",
    InvalidSupply: 2, "2": "InvalidSupply",
    ZeroAmount: 3, "3": "ZeroAmount",
});

const SwapResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_swapresult_free(ptr >>> 0, 1));

export class SwapResult {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(SwapResult.prototype);
        obj.__wbg_ptr = ptr;
        SwapResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SwapResultFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_swapresult_free(ptr, 0);
    }
    /**
     * @returns {bigint}
     */
    get virtuals_amount() {
        const ret = wasm.__wbg_get_swapresult_virtuals_amount(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * @param {bigint} arg0
     */
    set virtuals_amount(arg0) {
        wasm.__wbg_set_swapresult_virtuals_amount(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {bigint}
     */
    get token_amount() {
        const ret = wasm.__wbg_get_swapresult_token_amount(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * @param {bigint} arg0
     */
    set token_amount(arg0) {
        wasm.__wbg_set_swapresult_token_amount(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {bigint}
     */
    get fee_amount() {
        const ret = wasm.__wbg_get_swapresult_fee_amount(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * @param {bigint} arg0
     */
    set fee_amount(arg0) {
        wasm.__wbg_set_swapresult_fee_amount(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {bigint}
     */
    get total_virtuals_amount() {
        const ret = wasm.__wbg_get_swapresult_total_virtuals_amount(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * @param {bigint} arg0
     */
    set total_virtuals_amount(arg0) {
        wasm.__wbg_set_swapresult_total_virtuals_amount(this.__wbg_ptr, arg0);
    }
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbg_error_7534b8e9a36f1ab4 = function(arg0, arg1) {
        let deferred0_0;
        let deferred0_1;
        try {
            deferred0_0 = arg0;
            deferred0_1 = arg1;
            console.error(getStringFromWasm0(arg0, arg1));
        } finally {
            wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
        }
    };
    imports.wbg.__wbg_new_8a6f238a6ece86ea = function() {
        const ret = new Error();
        return ret;
    };
    imports.wbg.__wbg_stack_0ed75d68575b0f3c = function(arg0, arg1) {
        const ret = arg1.stack;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbindgen_bigint_from_u128 = function(arg0, arg1) {
        const ret = BigInt.asUintN(64, arg0) << BigInt(64) | BigInt.asUintN(64, arg1);
        return ret;
    };
    imports.wbg.__wbindgen_bigint_from_u64 = function(arg0) {
        const ret = BigInt.asUintN(64, arg0);
        return ret;
    };
    imports.wbg.__wbindgen_error_new = function(arg0, arg1) {
        const ret = new Error(getStringFromWasm0(arg0, arg1));
        return ret;
    };
    imports.wbg.__wbindgen_init_externref_table = function() {
        const table = wasm.__wbindgen_export_3;
        const offset = table.grow(4);
        table.set(0, undefined);
        table.set(offset + 0, undefined);
        table.set(offset + 1, null);
        table.set(offset + 2, true);
        table.set(offset + 3, false);
        ;
    };
    imports.wbg.__wbindgen_number_new = function(arg0) {
        const ret = arg0;
        return ret;
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };

    return imports;
}

function __wbg_init_memory(imports, memory) {

}

function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedDataViewMemory0 = null;
    cachedUint8ArrayMemory0 = null;


    wasm.__wbindgen_start();
    return wasm;
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (typeof module !== 'undefined') {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module} = module)
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
        }
    }

    const imports = __wbg_get_imports();

    __wbg_init_memory(imports);

    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }

    const instance = new WebAssembly.Instance(module, imports);

    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (typeof module_or_path !== 'undefined') {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path} = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }

    if (typeof module_or_path === 'undefined') {
        module_or_path = new URL('virtuals_curve_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    __wbg_init_memory(imports);

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync };
export default __wbg_init;
