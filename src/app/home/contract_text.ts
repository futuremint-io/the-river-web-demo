export const card_contract_source = `
export function handle(state, action) {
    const input = action.input;
    const caller = action.caller;
    const caller_share = 10;
    const owner = state.owner;
    const owner_share = 100;


    if (input.function === 'tip') {

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
    if (input.function === 'curate') {

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
}
`;
export const card_contract_initial_state = `
{
    "owner": "CcYmjJCv95_7TKeJBh93fALSp2t9hqQk2WkMoyfMTXE",
    "name": "Gendered Environments",
    "description":"Karen Bell proposes environmental justice research, teaching, policy and practice should be made more gender aware.",
    "tags": ["Gender", "Environment", "Farming", "Food", "Equality"],
    "ticker": "EQS",
    "copies":{
        "purchased":0,
        "available":100,
        "contributors":[]
    },  
    "balances": {}
}
`;