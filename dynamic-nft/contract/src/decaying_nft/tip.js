export default function tip(state, action) {
    const input = action.input;
    const caller = action.caller;
    const caller_share = 10;
    const owner = state.owner;
    const owner_share = 100;

    state.copies.purchased += 1;
    state.copies.available -= 1;

    state.copies.contributors.push(caller);

    if (caller in state.balances) {
        // Wallet already exists in state, add new tokens
        state.balances[caller] += caller_share
    } else {
        // Wallet is new, set starting balance
        state.balances[caller] = caller_share
    }
    console.log(state.balances[caller]);

    if (owner in state.balances) {
        // Wallet already exists in state, add new tokens
        state.balances[owner] += owner_share
    } else {
        // Wallet is new, set starting balance
        state.balances[owner] = owner_share
    }
    console.log(state.balances[owner]);

return { state }
}
