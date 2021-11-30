export default function curate(state, action) {
    const input = action.input;
    const caller = action.caller;

    if (caller in state.balances) {
        // Wallet already exists in state, add new tokens
        state.balances[caller] += 2
    } else {
        // Wallet is new, set starting balance
        state.balances[caller] = 2
    }
    console.log(state.balances[caller]);

    return { state }
}
